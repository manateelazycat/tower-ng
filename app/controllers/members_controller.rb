# coding: utf-8
class MembersController < ApplicationController
  def index
    # Create memeber array.
    @member_array = Array.new

    # Push creator at first.
    team = Team.find_by_hashid(params[:team_id])
    team_creator = User.find_by_email(team.creator)

    @member_array.push(
      {name: team_creator.name,
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
          {name: user.name,
           type: member_type,
           email: user.email,
           color: member_color
          }
        )
      else
        @member_array.push(
          {name: user.email.split("@")[0],
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

  def create
    params[:members].values().reverse.uniq{|m| m[0]}.reverse.each do |member|
      user = User.new(email: member[0])
      user.save

      team = Team.find_by_hashid(params[:team_id])

      team_admin = TeamAdmin.new(team_id: team.id, user_id: user.id, is_administrator: member[1] == "admin")
      team_admin.save

    end
    
    redirect_to team_members_path
  end
end
