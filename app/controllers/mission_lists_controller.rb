class MissionListsController < ApplicationController
  def create
    name = params[:name]
    project_id = params[:project_id]
    project = Project.find_by_hashid(project_id)


    respond_to do |format|
      if project.mission_lists.map { |m| m.name }.include?(name)
        format.json {
          render :json => {
                   :status => "duplicated"
                 }}
      else
        mission_list = project.mission_lists.create(
          name: name,
          project_id: project_id
        )
        mission_list.save

        format.json {
          render :json => {
                   :status => "created",
                   :html => render_to_string(
                     :template => "mission_lists/create_mission_list.html.erb",
                     :formats => :html,
                     :layout => false,
                     :locals => {:mission_list => mission_list}
                   )
                 }}
      end
    end
  end
end