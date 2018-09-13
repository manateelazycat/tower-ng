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

  def update
    return unless params[:action_type] && params[:action_type] == "update_mission_distributor"

    mission = Mission.find_by_hashid(params[:id])
    mission.user_id = params[:user_id].empty? ? nil : User.find(params[:user_id]).id
    mission.finish_time = params[:finish_date].empty? ? nil : DateTime.parse(params[:finish_date])

    mission.save

    respond_to do |format|
      format.json do
        render json: { distributor_info: mission.format_distributor_info }
      end
    end
  end

  def show
    @mission = Mission.find_by_hashid(params[:id])
    @project = Project.find_by_hashid(params[:project_id])
    @mission_list = MissionList.find(@mission.mission_list_id)

    # Create memeber array.
    @member_array = []

    # Push creator at first.
    team = current_team
    team_creator = User.find_by_email(team.creator)

    @member_array.push(user_hashid: team_creator.hashid,
                       name: team_creator.name,
                       pinyin: team_creator.pinyin,
                       photo_url: team_creator.avatar_url)

    # Push team members.
    TeamAdmin.select { |t| t.team_id == team.id }.each do |team_admin|
      user = User.find_by_id(team_admin.user_id)

      next unless user&.activated?

      @member_array.push(user_hashid: user.hashid,
                         name: user.name,
                         pinyin: user.pinyin,
                         photo_url: user.avatar_url)
    end
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
