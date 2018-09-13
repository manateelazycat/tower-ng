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
end
