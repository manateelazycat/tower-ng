# coding: utf-8
class UsersController < ApplicationController
  def show
  end
  
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      @user.send_activation_email
      flash[:info] = "请检查你的邮件"
      redirect_to root_url
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
