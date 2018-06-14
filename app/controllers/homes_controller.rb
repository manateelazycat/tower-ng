class HomesController < ApplicationController
  def new
    if logged_in?
      jump_to_team_homepage(current_user)
    end
  end
end
