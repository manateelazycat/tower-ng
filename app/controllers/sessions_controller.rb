# coding: utf-8
class SessionsController < ApplicationController
  def new
    
  end
  
  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      if user.activated?
        log_in user
        params[:session][:remeber_me] == '1' ? remeber(user) : forget(user)
        redirect_to teams_path
      else
        message = "账户还未激活"
        message += "请检查邮件已激活账户"
        flash[:warning] = message
        redirect_to root_url
      end
    else
      flash.now[:danger] = "错误的邮箱或密码"
      render 'new'
    end
  end
  
  def destroy
    log_out if logged_in?
    redirect_to root_url
  end
end
