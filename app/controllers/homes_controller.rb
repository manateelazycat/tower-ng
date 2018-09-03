# frozen_string_literal: true

# Home controller.
class HomesController < ApplicationController
  def new
    jump_to_team_homepage if logged_in?
  end
end
