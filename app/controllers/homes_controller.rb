class HomesController < ApplicationController
  def new
    if logged_in?
      redirect_to teams_path
    end
  end
end
