# coding: utf-8
class PasswordResetsController < ApplicationController
  before_action :get_user, only: [:edit, :update]
  before_action :valid_user, only: [:edit, :update]
  before_action :check_expiration, only: [:edit, :update]
  
  def new
  end
  
  def create
    @user = User.find_by(email: params[:password_reset][:email].downcase)
    if @user
      @user.create_reset_digest
      @user.send_password_reset_email
      flash[:info] = "已经发送密码重设邮件，请查收"
      redirect_to root_url
    else
      flash.now[:danger] = "没有发现您填写的邮箱地址"
      render 'new'
    end
  end
  
  def edit
    
  end
  
  def update
    if params[:user][:password].empty?
      @user.errors.add(:password, "密码不能为空")
      render 'edit'
    elsif @user.update_attributes(user_params)
      log_in @user
      flash[:success] = "密码重设成功"
      jump_to_user_team(@user)
    else
      render 'edit'
    end
  end
  
  private
  def get_user
    @user = User.find_by(email: params[:email])
  end
  
  def valid_user
    unless (@user && @user.activated? && @user.authenticated?(:reset, params[:id]))
      redirect_to root_url
    end
  end
  
  def user_params
    params.require(:user).permit(:password)
  end
  
  def check_expiration
    if @user.password_reset_expired?
      flash[:danger] = "密码重设已经过期"
      redirect_to new_password_reset_url
    end
  end
end
