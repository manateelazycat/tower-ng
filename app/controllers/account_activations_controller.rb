# coding: utf-8
class AccountActivationsController < ApplicationController
  def edit
    user = User.find_by(email: params[:email])
    if user && !user.activated? && user.authenticated?(:activation, params[:id])
      if params.has_key?(:team_id)
        redirect_to new_join_url(email: params[:email], user_id: user.hashid, team_id: params[:team_id])
      else
        user.activate
        log_in user
        flash[:success] = "账户已经激活, 自动登录"
        jump_to_team_homepage(user)
      end
    else
      flash[:danger] = "不合法的激活链接"
      redirect_to root_url
    end
  end
end
