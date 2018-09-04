# frozen_string_literal: true

# Session helper functions.
module SessionsHelper
  def log_in(user)
    session[:user_id] = user.id
  end

  def remember(user)
    user.remeber
    cookies.permanent.signed[:user_id] = user.id
    cookies.permanent[:remember_token] = user.remember_token
  end

  def current_user
    if (user_id = session[:user_id])
      @current_user ||= User.find_by(id: user_id)
    elsif (user_id = cookies.signed[:user_id])
      user = User.find_by(id: user_id)
      if user&.authenticated?(:remember, cookies[:remember_token])
        log_in user
        @current_user = user
      end
    end
  end

  def logged_in?
    !current_user.nil?
  end

  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  def log_out
    forget(current_user)
    session.delete(:user_id)
    @current_user = nil
  end

  def jump_to_team_homepage
    team = current_team
    redirect_to team_projects_url(team.hashid) if team
  end

  def current_team
    return unless current_user

    return Team.find(current_user.team_id) if current_user.team_id

    return if current_temas.empty?

    first_team = current_teams[0]
    current_user.team_id = first_team.id

    first_team
  end

  def current_temas
    return [] unless current_user

    teams = Team.select { |t| t.creator == current_user.email }

    if teams.empty?
      TeamAdmin.select { |t| t.user_id == current_user.id }.map { |team_admin| Team.find(team_admin.team_id) }
    else
      teams
    end
  end

  def team_administrator?
    current_team.creator == current_user.email || !TeamAdmin.select { |team_admin| team_admin.team_id == current_team.id && team_admin.user_id == current_user.id && team_admin.is_administrator }.empty?
  end
end
