# coding: utf-8
class MembersController < ApplicationController
  def index
    # Create memeber array.
    @member_array = Array.new

    # Push creator at first.
    team = Team.find_by_hashid(params[:team_id])
    team_creator = User.find_by_email(team.creator)

    @member_array.push(
      {user_hashid: team_creator.hashid,
       name: team_creator.name,
       type: "超级管理员",
       email: team_creator.email,
       color: "member-type-super-admin"
      }
    )

    # Push team members.
    TeamAdmin.select{|t| t.team_id == team.id}.each do |team_admin|
      user = User.find_by_id(team_admin.user_id)

      member_type = team_admin.is_administrator ? "管理员" : "成员"
      member_color = team_admin.is_administrator ? "member-type-admin" : "member-type-member"

      if user.activated?
        @member_array.push(
          {user_hashid: user.hashid,
           name: user.name,
           type: member_type,
           email: user.email,
           color: member_color
          }
        )
      else
        @member_array.push(
          {user_hashid: user.hashid,
           name: user.email.split("@")[0],
           type: "已邀请",
           email: user.email,
           color: member_color
          }
        )
      end
    end
  end

  def new

  end

  def show
    team = Team.find_by(creator: current_user.email)
    params[:team_id] = team.hashid

    @project = Project.find_by_hashid(params[:id])

    @user = User.find_by_hashid(params[:id])

    if @user.activated?
      redirect_to user_path(@user.id)
    else
      @user_name = @user.email.split("@")[0]
    end
  end

  def create
    params[:members].values().reverse.uniq{|m| m[0]}.reverse.each do |member|
      user = User.find_by_email(member[0])

      unless user
        user = User.new(email: member[0])
        user.save

        print("Send activation mail: ", edit_account_activation_url(user.activation_token, email: user.email, team_id: params[:team_id]))
      end

      team = Team.find_by_hashid(params[:team_id])

      team_admin = TeamAdmin.new(team_id: team.id, user_id: user.id, is_administrator: member[1] == "admin")
      team_admin.save

    end

    redirect_to team_members_path
  end

  def edit
    if params[:action_type] == "cancel_invite"

      user = User.find_by_hashid(params[:id])

      if user.activated?
        redirect_to user_path(user.id)
      else
        team_admin = TeamAdmin.find_by_user_id(user.id)
        team_admin.destroy

        user.destroy

        team = Team.find_by(creator: current_user.email)
        params[:team_id] = team.hashid

        respond_to do |format|
          format.json {
            render :json => {
                     :status => "successful",
                     :redirect => team_members_url(team.hashid),
                   }
          }
        end
      end

    elsif params[:action_type] == "resend_invite_email"

      user = User.find_by_hashid(params[:id])

      if user.activated?
        redirect_to user_path(user.id)
      else
        user_activation_token = User.new_token
        user_activation_digest = User.digest(user_activation_token)
        user.update_attribute(:activation_digest, user_activation_digest)

        team = Team.find_by(creator: current_user.email)
        params[:team_id] = team.hashid

        print("Send activation mail: ", edit_account_activation_url(user_activation_token, email: user.email, team_id: params[:team_id]))

        respond_to do |format|
          format.json {
            render :json => {
                     :status => "successful",
                   }
          }
        end
      end

    end
  end
end
