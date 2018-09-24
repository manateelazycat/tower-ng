# frozen_string_literal: true

# Controller for show finished mission.
class FinishedMissionsController < ApplicationController
  def index
    user = User.find_by_hashid(params[:user_id])
    @mission_list = show_finished_mission(user.id)
  end
end
