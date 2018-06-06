class HomesController < ApplicationController
  def new
    if logged_in?
      jump_to_user_team(current_user)
    end
  end
end
