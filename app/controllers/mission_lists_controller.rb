class MissionListsController < ApplicationController
  def create
    name = params[:name]
    project_id = params[:project_id]
    project = Project.find_by_hashid(project_id)

    print("******* ", project.mission_lists.map { |m| m.name })

    result = {}

    if project.mission_lists.map { |m| m.name }.include?(name)
      result["status"] = "duplicated"
    else
      mission_list = project.mission_lists.create(
        name: name,
        project_id: project_id
      )
      mission_list.save

      result["status"] = "created"
    end

    render :json => result.to_json
  end
end
