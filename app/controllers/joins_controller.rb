# -*- coding: utf-8 -*-
class JoinsController < ApplicationController
  def new

  end

  def create
    if params[:join][:name].empty?
      flash[:warning] = "名字不能为空"
      render "new"
    elsif params[:join][:password].empty?
      flash[:warning] = "密码不能为空"
      render "new"
    else
      user = User.find_by_hashid(params[:user_id])
      user.update_attribute(:name, params[:join][:name])
      user.update_password(params[:join][:password])
      user.activate
      log_in user

      redirect_to team_projects_url(params[:team_id])
    end

  end
end
