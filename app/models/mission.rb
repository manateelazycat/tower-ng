# frozen_string_literal: true

# Mission.
class Mission < ApplicationRecord
  include Hashid::Rails

  belongs_to :mission_list

  has_many :comments, dependent: :destroy

  def format_finish_time
    finish_time.nil? ? "" : finish_time.strftime("%Y-%m-%d")
  end

  def user_name
    user_id.nil? ? "" : User.find(user_id).name
  end

  def finish_log
    user_name = ""

    if finish_by_user && User.exists?(finish_by_user)
      user = User.find(finish_by_user)
      user_name = user.name + ", "
    end

    user_name + format_time_ago(finish_time)
  end

  def project_hashid
    Project.find(MissionList.find(mission_list_id).project_id).hashid
  end

  def project_name
    Project.find(MissionList.find(mission_list_id).project_id).name
  end

  def format_distributor_info
    if !user_id && !finish_time
      "未指派"
    elsif user_id && finish_time
      user_name + " " + format_finish_time
    elsif user_id
      user_name
    elsif finish_time
      format_finish_time
    end
  end

  def mission_distributor_button_class
    if !user_id && !finish_time
      "mission-distributor-button mission-distributor-empty"
    elsif finish_time && Date.current > finish_time
      "mission-distributor-button mission-distributor-delay"
    else
      "mission-distributor-button mission-distributor-confirm"
    end
  end
end
