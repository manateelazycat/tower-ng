# frozen_string_literal: true

# Manage user's mission.
class UserMissionsController < ApplicationController
  def assignment_mission(user_id, mission_id)
    match_missin = find_match_mission(mission_id)

    if match_missin
      match_missin.user_id = user_id
      match_missin.is_open = true
      match_missin.save
    else
      mission = UserMission.new(user_id: user_id, team_id: current_team.id, mission_id: mission_id, is_open: true)
      mission.save
    end
  end

  def cancel_mission(mission_id)
    UserMission.destroy_all(team_id: current_team.id, mission_id: mission_id)
  end

  def finish_mission(user_id, mission_id)
    match_missin = find_match_mission(mission_id)

    if match_missin
      match_missin.user_id = user_id
      match_missin.is_open = false
      match_missin.save
    else
      mission = UserMission.new(user_id: user_id, team_id: current_team.id, mission_id: mission_id, is_open: false)
      mission.save
    end
  end

  def reopen_mission(mission_id)
    match_missin = find_match_mission(mission_id)

    return unless match_missin

    match_missin.is_open = true
    match_missin.save
  end

  def show_unfinished_mission(user_id)
    missions = UserMission.select { |um| um.user_id == user_id && um.team_id == current_team.id && um.is_open }

    missions.select { |mission| Mission.find(mission.mission_id) }
  end

  def show_finished_mission(user_id)
    UserMission.select { |um| um.user_id == user_id && um.team_id == current_team.id && !um.is_open }
  end

  def show_created_mission(user_id)
    user = User.find(user_id)

    return unless user

    user.mission_created_list
  end

  # Find all matches and delete duplicate just keep first match.
  # Return nil if nothing found.
  def find_match_mission(mission_id)
    first, *rest = UserMission.select { |um| um.team_id == current_team.id && um.mission_id == mission_id }

    rest.destroy_all

    first
  end
end
