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

  def edit
    mission = Mission.find_by_hashid(params[:id])

    if mission then
      mission.name = params[:name]

      if params.key?(:summary)
        mission.summary = params[:summary]
      end

      mission.save
    end

    respond_to do |format|
      format.json {
        render :json => {
                 :status => "update",
               }
      }
    end
  end

  def show
    team = Team.find_by(creator: current_user.email)
    params[:team_id] = team.hashid

    @mission = Mission.find_by_hashid(params[:id])
    @project = Project.find_by_hashid(params[:project_id])
    @mission_list = MissionList.find(@mission.mission_list_id)
  end

  def destroy
    mission = Mission.find_by_hashid(params[:id])

    if mission then
      mission.destroy
    end

    respond_to do |format|
      format.json {
        render :json => {
                 :status => "destroy",
                 :redirect => project_url(params[:project_id])
               }}
    end
  end

end
