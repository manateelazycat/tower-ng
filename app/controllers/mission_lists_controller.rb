class MissionListsController < ApplicationController
  def create
    name = params[:name]
    project_id = params[:project_id]
    @project = Project.find_by_hashid(project_id)

    respond_to do |format|
      if @project.mission_lists.map { |m| m.name }.include?(name)
        format.json {
          render :json => {
                   :status => "duplicated"
                 }}
      else
        mission_list = @project.mission_lists.create(
          name: name,
          project_id: project_id
        )
        mission_list.save

        format.json {
          render :json => {
                   :status => "created",
                   :mission_list_id => mission_list.hashid,
                   :mission_list_item_html => render_to_string(
                     :template => "mission_lists/_create_mission_list_item.html.erb",
                     :formats => :html,
                     :layout => false,
                     :locals => {:mission_list => mission_list}
                   ),
                   :mission_list_html => render_to_string(
                     :template => "mission_lists/_create_mission_list.html.erb",
                     :formats => :html,
                     :layout => false,
                     :locals => {:mission_list => mission_list}
                   )
                 }}
      end
    end
  end

  def show
    team = Team.find_by(creator: current_user.email)
    params[:team_id] = team.hashid

    @mission_list = MissionList.find_by_hashid(params[:id])

    @project = Project.find_by_hashid(params[:project_id])
  end

  def destroy
    mission_list = MissionList.find_by_hashid(params[:id])

    if mission_list then
      mission_list.destroy
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
