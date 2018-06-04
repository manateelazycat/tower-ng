class UsersController < ApplicationController
  def show
  end
  
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render html: "Add user " + user_params["name"]
    else
      render 'new'
    end
  end

  private
  def user_params
    params.require(:user).permit(:name, :email, :password)
  end
end
