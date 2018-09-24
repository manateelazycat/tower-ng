# frozen_string_literal: true

# Base abstract record class.
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def format_time_ago(time)
    seconds = DateTime.now.to_time.to_i - time.to_time.to_i

    case seconds
    when 0..60 then "刚刚"
    when 60..3600 then format("%<minute>i分钟前", minute: seconds / 60)
    when 3600..3600 * 24 then format("%<hour>i小时前", hour: seconds / 3600)
    else created_at.strftime("%Y-%m-%d")
    end
  end
end
