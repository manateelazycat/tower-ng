class UsersController < ApplicationController
  def show
  end
  
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to teams_path
    else
      flash.now[:danger] = @user.errors.full_messages.first
      render 'new'
    end
  end

  private
  def user_params
    params.require(:user).permit(:name, :email, :password)
  end
end
