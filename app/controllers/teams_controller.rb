class TeamsController < ApplicationController
  def new
  end
  
  def index
  end
  
  def edit
    
  end
  
  def show
    # Redirect to root path if no user log in.
    if !logged_in?
      redirect_to root_path
    end
  end
end
