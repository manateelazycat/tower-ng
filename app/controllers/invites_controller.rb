# coding: utf-8
class InvitesController < ApplicationController
  def new
  end

  def create
    params[:members].values().reverse.uniq{|m| m[0]}.reverse.each do |member|
      user = User.new(email: member[0])
      user.save

      team = Team.find_by_hashid(params[:team_id])

      team_admin = TeamAdmin.new(team_id: team.id, user_id: user.id, is_administrator: member[1] == "admin")
      team_admin.save

      print("**** ", member[0], " ", member[1], "\n")
    end
  end
end
