# coding: utf-8
class SessionsController < ApplicationController
  def new
    
  end
  
  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      log_in user
      redirect_to teams_path
    else
      flash.now[:danger] = "错误的邮箱或密码"
      render 'new'
    end
  end
  
  def destroy
    log_out
    redirect_to root_url
  end
end
