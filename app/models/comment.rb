# frozen_string_literal: true

# User comment for mission.
class Comment < ApplicationRecord
  include Hashid::Rails

  belongs_to :mission

  def format_comment_date
    format_time_ago(created_at)
  end
end
