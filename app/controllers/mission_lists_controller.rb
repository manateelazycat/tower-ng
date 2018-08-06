class MissionListsController < ApplicationController
  def create
    name = params[:name]
    project_id = params[:project_id]
    project = Project.find_by_hashid(project_id)

    print("******* ", project.mission_lists.map { |m| m.name })

    if project.mission_lists.map { |m| m.name }.include?(name)
      head "500"
    else
      mission_list = project.mission_lists.create(
        name: name,
        project_id: project_id
      )
      mission_list.save

      head "200"
    end

  end
end
