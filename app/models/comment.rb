# frozen_string_literal: true

# User comment for mission.
class Comment < ApplicationRecord
  include Hashid::Rails

  belongs_to :mission

  def format_comment_date
    seconds = DateTime.now.to_time.to_i - created_at.to_time.to_i

    case seconds
    when 0..60 then "刚刚"
    when 60..3600 then format("%<minute>i分钟前", minute: seconds / 60)
    when 3600..3600 * 24 then format("%<hour>i小时前", hour: seconds / 3600)
    else created_at.strftime("%Y-%m-%d")
    end

  end
end
