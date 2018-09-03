# frozen_string_literal: true

# Team controller.
class TeamsController < ApplicationController
  def new; end

  def index; end

  def edit; end

  def show
    # Redirect to root path if no user log in.
    redirect_to root_path unless logged_in?
  end
end
