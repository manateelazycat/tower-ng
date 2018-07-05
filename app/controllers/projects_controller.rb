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
    # Get team.
    team = Team.find_by_hashid(params[:team_id])

    # Create project.
    project = team.projects.create(
      team_id: params[:team_id],
      name: params[:project][:name],
      summary: params[:project][:summary],
      icon: @@glyphicon_list.sample,
    )
    project.save

    # Redirect to project home page after create new project.
    jump_to_team_homepage(current_user)
  end
end
