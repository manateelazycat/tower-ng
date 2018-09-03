class HomesController < ApplicationController
  def new
    if logged_in?
      jump_to_team_homepage
    end
  end
end
