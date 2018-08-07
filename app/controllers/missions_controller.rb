class MissionsController < ApplicationController
  def create
    mission_list = MissionList.find_by_hashid(params[:mission_list_id])

    mission = mission_list.missions.create(
      name: params[:name],
      is_finish: false,
      mission_list_id: params[:mission_list_id]
    )

    respond_to do |format|
      format.html {render 'create_mission',
                          :locals => {:mission => mission},
                          :layout => false}
    end

    # result = {"mission_id" => mission.hashid}
    # render :json => result.to_json
  end
end
