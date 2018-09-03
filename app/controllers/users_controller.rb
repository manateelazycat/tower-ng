# -*- coding: utf-8 -*-
class UsersController < ApplicationController
  def show
    team = Team.find_by(creator: current_user.email)
    params[:team_id] = team.hashid

    @project = Project.find_by_hashid(params[:id])
  end

  def new
    @user = User.new
  end

  def create
    check_user = User.find_by(email: user_params[:email].downcase)
    if check_user
      if check_user.activated?
        flash[:info] = "请直接登录"
        redirect_to sign_in_path
      else
        message = "账户还未激活, "
        message += "请检查邮件以激活账户"
        flash[:info] = message
        redirect_to root_url
      end
    elsif
 # Create team when user first sign up.
      team = Team.new(name: params[:team_name], creator: user_params[:email])
      team.save

      @user = User.new(user_params)
      if @user.save
        @user.send_activation_email
        flash[:info] = "请检查你的邮件"
        redirect_to root_url
      else
        flash.now[:danger] = @user.errors.full_messages.first
        render "new"
      end
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password)
  end
end
