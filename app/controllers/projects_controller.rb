# frozen_string_literal: true

# Project controller.
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

  def new; end

  def create
    # Create project.
    project = current_team.projects.create(
      team_id: current_team.id,
      name: params[:project][:name],
      summary: params[:project][:summary],
      icon: @@glyphicon_list.sample
    )
    project.save

    # Redirect to project home page after create new project.
    jump_to_team_homepage
  end

  def show
    @project = Project.find_by_hashid(params[:id])
  end

  def edit
    @project = Project.find_by_hashid(params[:id])
  end

  def destroy
    project = Project.find_by_hashid(params[:id])

    project&.destroy

    team = current_team

    respond_to do |format|
      format.json do
        render json: { status: "destroy",
                       redirect: team_projects_url(team.hashid) }
      end
    end
  end
end
