# frozen_string_literal: true

# Mission controller.
class MissionsController < ApplicationController
  def create
    mission_list = MissionList.find_by_hashid(params[:mission_list_id])

    mission = mission_list.missions.create(
      name: params[:name],
      is_finish: false,
      mission_list_id: params[:mission_list_id],
      user_id: (params[:user_id].nil? || params[:user_id].empty?) ? nil : User.find_by_hashid(params[:user_id]).id,
      finish_time: (params[:finish_date].nil? || params[:finish_date].empty?) ? nil : DateTime.parse(params[:finish_date]),
      creator: current_user.id
    )

    Activity.add_create_activity(current_user.id, mission.id)

    respond_to do |format|
      format.html do
        render "_create_mission",
               locals: { mission: mission,
                         show_project: false },
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
    return unless params[:action_type]

    case params[:action_type]
    when "update_mission_distributor"
      mission = Mission.find_by_hashid(params[:id])

      return unless mission

      old_distributor = mission.user_id
      old_finish_time = mission.finish_time

      mission.user_id = params[:user_id].empty? ? nil : User.find(params[:user_id]).id
      mission.finish_time = params[:finish_date].empty? ? nil : DateTime.parse(params[:finish_date])

      mission.save

      if mission.user_id.nil?
        cancel_mission(mission.id)
      else
        assignment_mission(mission.user_id, mission.id)
      end

      user_hashid = mission.user_id.nil? ? nil : User.find(mission.user_id).hashid

      if mission.user_id
        Activity.add_change_distributor_activity(current_user.id, mission.id, mission.user_id)
      else
        Activity.add_cancel_distributor_activity(current_user.id, mission.id, old_distributor)
      end

      Activity.add_change_finish_time_activity(current_user.id, mission.id, old_finish_time, mission.finish_time)

      respond_to do |format|
        format.json do
          render json: { distributor_info: mission.format_distributor_info,
                         userid: mission.user_id,
                         username: mission.user_name,
                         date: mission.format_finish_time,
                         css: mission.mission_distributor_button_class,
                         user_hashid: user_hashid
                       }
        end
      end
    when "close_mission"
      mission = Mission.find_by_hashid(params[:id])

      return unless mission

      mission.is_finish = true
      mission.finish_time = DateTime.now
      mission.finish_by_user = current_user.id
      mission.save

      finish_mission(current_user.id, mission.id)

      Activity.add_finish_activity(current_user.id, mission.id)

      respond_to do |format|
        format.html do
          render "_closed_mission",
                 locals: { mission: mission },
                 layout: false
        end
      end
    when "reopen_mission"
      mission = Mission.find_by_hashid(params[:id])

      return unless mission

      mission.is_finish = false
      mission.finish_time = nil
      mission.finish_by_user = nil
      mission.save

      reopen_mission(mission.id)

      Activity.add_reopen_activity(current_user.id, mission.id)

      respond_to do |format|
        format.html do
          render "_opened_mission",
                 locals: { mission: mission,
                           show_project: params[:at_user_page] == "true" },
                 layout: false
        end
      end
    end
  end

  def show
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
