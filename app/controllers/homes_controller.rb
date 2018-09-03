# frozen_string_literal: true

# Home controller.
class HomesController < ApplicationController
  def new
    logged_in? && jump_to_team_homepage
  end
end
