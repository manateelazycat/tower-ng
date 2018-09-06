# frozen_string_literal: true

# Control team member.
class MembersController < ApplicationController
  def index
    # Create memeber array.
    @member_array = []

    # Push creator at first.
    team = current_team
    team_creator = User.find_by_email(team.creator)

    @member_array.push(user_hashid: team_creator.hashid,
                       name: team_creator.name,
                       type: "超级管理员",
                       email: team_creator.email,
                       color: "member-type-super-admin",
                       photo_url: current_user.avatar_url)

    # Push team members.
    TeamAdmin.select { |t| t.team_id == team.id }.each do |team_admin|
      user = User.find_by_id(team_admin.user_id)

      member_type = team_admin.is_administrator ? "管理员" : "成员"
      member_color = team_admin.is_administrator ? "member-type-admin" : "member-type-member"

      if user&.activated?
        @member_array.push(user_hashid: user.hashid,
                           name: user.name,
                           type: member_type,
                           email: user.email,
                           color: member_color,
                           photo_url: user.avatar_url)

      elsif !user.nil?
        @member_array.push(user_hashid: user.hashid,
                           name: user.email.split("@")[0],
                           type: "已邀请",
                           email: user.email,
                           color: member_color,
                           photo_url: user.avatar_url)

      end
    end
  end

  def new; end

  def show
    @project = Project.find_by_hashid(params[:id])
    @user = User.find_by_hashid(params[:id])

    if @user&.activated?
      redirect_to user_path(@user.id)
    else
      @user_name = @user.email.split("@")[0]
    end
  end

  def create
    params[:members].values.reverse.uniq { |m| m[0] }.reverse_each do |member|
      user = User.find_by_email(member[0])

      unless user
        user = User.new(email: member[0])
        user.save

        print("Send activation mail: ", edit_account_activation_url(user.activation_token, email: user.email, team_id: current_team.hashid), "\n")
      end

      team_admin = TeamAdmin.new(team_id: current_team.id, user_id: user.id, is_administrator: member[1] == "admin")
      team_admin.save
    end

    redirect_to team_members_path
  end

  def edit
    if params[:action_type] == "cancel_invite"

      user = User.find_by_hashid(params[:id])

      if user&.activated?
        redirect_to user_path(user.id)
      else
        team_admin = TeamAdmin.find_by_user_id(user.id)
        team_admin&.destroy

        user&.destroy

        respond_to do |format|
          format.json do
            render json: { status: "successful",
                           redirect: team_members_url(current_team.hashid) }
          end
        end
      end

    elsif params[:action_type] == "resend_invite_email"

      user = User.find_by_hashid(params[:id])

      if user&.activated?
        redirect_to user_path(user.id)
      else
        user_activation_token = User.new_token
        user_activation_digest = User.digest(user_activation_token)
        user.update_attribute(:activation_digest, user_activation_digest)

        print("Send activation mail: ", edit_account_activation_url(user_activation_token, email: user.email, team_id: current_team.hashid), "\n")

        respond_to do |format|
          format.json do
            render json: { status: "successful" }
          end
        end
      end

    end
  end
end
