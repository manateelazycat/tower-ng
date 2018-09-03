# frozen_string_literal: true

# Mission controller.
class MissionsController < ApplicationController
  def create
    mission_list = MissionList.find_by_hashid(params[:mission_list_id])

    mission = mission_list.missions.create(
      name: params[:name],
      is_finish: false,
      mission_list_id: params[:mission_list_id]
    )

    respond_to do |format|
      format.html do
        render "_create_mission",
               locals: { mission: mission },
               layout: false
      end
    end
  end

  def edit
    mission = Mission.find_by_hashid(params[:id])

    if mission
      mission.name = params[:name]

      mission.summary = params[:summary] if params.key?(:summary)

      mission.save
    end

    respond_to do |format|
      format.json do
        render json: { status: "update" }
      end
    end
  end

  def show
    team = current_team
    params[:team_id] = team.hashid

    @mission = Mission.find_by_hashid(params[:id])
    @project = Project.find_by_hashid(params[:project_id])
    @mission_list = MissionList.find(@mission.mission_list_id)
  end

  def destroy
    mission = Mission.find_by_hashid(params[:id])

    mission&.destroy

    respond_to do |format|
      format.json do
        render json: { status: "destroy",
                       redirect: project_url(params[:project_id]) }
      end
    end
  end
end
