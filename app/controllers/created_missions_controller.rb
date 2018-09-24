# frozen_string_literal: true

# Controller for show created mission.
class CreatedMissionsController < ApplicationController
  def index
    user = User.find_by_hashid(params[:user_id])

    @mission_list = Mission.where("creator like ?", user.id)
  end
end
