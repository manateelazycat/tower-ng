# coding: utf-8
class ProjectsController < ApplicationController
  @@glyphicon_list = ["glyphicon-inbox",
                      "glyphicon-time",
                      "glyphicon-lock",
                      "glyphicon-print",
                      "glyphicon-camera",
                      "glyphicon-fire",
                      "glyphicon-plane",
                      "glyphicon-shopping-cart",
                      "glyphicon-hdd",
                      "glyphicon-globe",
                      "glyphicon-phone",
                      "glyphicon-flash",
                      "glyphicon-stats"]

  def new
  end

  def create
    puts "********"
    puts params[:project][:name]
    puts params[:project][:summary]
    puts params[:team_id]
    puts @@glyphicon_list.sample
    puts "********"

    jump_to_team_homepage(current_user)
  end
end
