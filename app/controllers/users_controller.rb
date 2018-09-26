# frozen_string_literal: true

# User controller.
class UsersController < ApplicationController
  def show
    @user = User.find_by_hashid(params[:id])
    @mission_list = show_unfinished_mission(@user.id)
  end

  def new
    @user = User.new
  end

  def create
    check_user = User.find_by(email: params[:user][:email].downcase)
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
    else
      # Create team when user first sign up.
      team = Team.new(name: params[:team_name], creator: params[:user][:email])
      team.save

      @user = User.new(name: params[:user][:name], email: params[:user][:email])
      @user.update_pinyin
      @user.update_password(params[:user][:password])

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

  def update
    current_user.photo = params[:user][:photo]
    current_user.save!

    respond_to do |format|
      format.json do
        render json: { photo_url: current_user.photo_url }
      end
    end
  end
end
