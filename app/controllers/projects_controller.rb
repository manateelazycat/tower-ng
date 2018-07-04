class ProjectsController < ApplicationController
  def index
  end

  def new
  end

  def create
    puts "********"
    puts params[:project][:name]
    puts params[:project][:summary]
    puts "********"

    jump_to_team_homepage(current_user)
  end
end
