class MissionsController < ApplicationController
  def create
    mission_list = MissionList.find_by_hashid(params[:mission_list_id])

    mission = mission_list.missions.create(
      name: params[:name],
      is_finish: false,
      mission_list_id: params[:mission_list_id]
    )

    respond_to do |format|
      format.html {render '_create_mission',
                          :locals => {:mission => mission},
                          :layout => false}
    end
  end

  def destroy
    mission = Mission.find_by_hashid(params[:id])

    if mission then
      mission.destroy
    end

    respond_to do |format|
      format.json {
        render :json => {:status => "destroy"}}
    end
  end
end
