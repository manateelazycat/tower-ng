# frozen_string_literal: true

# Mission list controller.
class MissionListsController < ApplicationController
  def create
    name = params[:name]
    project_id = params[:project_id]
    @project = Project.find_by_hashid(project_id)

    respond_to do |format|
      if @project.mission_lists.map(&:name).include?(name)
        format.json do
          render json: { status: "duplicated" }
        end
      else
        mission_list = @project.mission_lists.create(
          name: name,
          project_id: project_id
        )
        mission_list.save

        format.json do
          render json: { status: "created",
                         mission_list_id: mission_list.hashid,
                         mission_list_item_html: render_to_string(
                           template: "mission_lists/_create_mission_list_item.html.erb",
                           formats: :html,
                           layout: false,
                           locals: { mission_list: mission_list }
                         ),
                         mission_list_html: render_to_string(
                           template: "mission_lists/_create_mission_list.html.erb",
                           formats: :html,
                           layout: false,
                           locals: { mission_list: mission_list }
                         ) }
        end
      end
    end
  end

  def show
    team = current_team
    params[:team_id] = team.hashid

    @mission_list = MissionList.find_by_hashid(params[:id])

    @project = Project.find_by_hashid(params[:project_id])
  end

  def destroy
    mission_list = MissionList.find_by_hashid(params[:id])

    mission_list&.destroy

    respond_to do |format|
      format.json do
        render json: { status: "destroy",
                       redirect: project_url(params[:project_id]) }
      end
    end
  end

  def edit
    mission_list = MissionList.find_by_hashid(params[:id])

    if mission_list
      mission_list.name = params[:name]
      mission_list.save
    end

    respond_to do |format|
      format.json do
        render json: { status: "update" }
      end
    end
  end
end
