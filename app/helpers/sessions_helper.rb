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
      if user && user.authenticated?(:remember, cookies[:remember_token])
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
    team = get_current_team
    if team
      redirect_to team_projects_url(team.hashid)
    end
  end

  def get_current_team
    if current_user
      if current_user.team_id
        return Team.find(current_user.team_id)
      else
        teams = get_current_teams

        if teams.length > 0
          first_team = teams[0]
          current_user.team_id = first_team.id

          return first_team
        else
          return nil
        end
      end
    else
      return nil
    end
  end

  def get_current_teams
    if current_user
      teams = Team.select{|t| t.creator == current_user.email}

      if teams.length > 0
        return teams
      else
        return TeamAdmin.select{|t| t.user_id == current_user.id}.map{|team_admin| Team.find(team_admin.team_id)}
      end
    else
      return []
    end
  end

end
