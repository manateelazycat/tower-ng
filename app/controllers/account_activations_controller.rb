# coding: utf-8
class AccountActivationsController < ApplicationController
  def edit
    user = User.find_by(email: params[:email])
    if user && !user.activated? && user.authenticated?(:activation, params[:id])
      user.activate
      log_in user
      flash[:success] = "账户已经激活, 自动登录"
      jump_to_user_team(user)
    else
      flash[:danger] = "不合法的激活链接"
      redirect_to root_url
    end
  end
end
