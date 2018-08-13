# coding: utf-8
class Comment < ApplicationRecord
  include Hashid::Rails

  belongs_to :mission

  def get_format_date
    seconds = DateTime.now.to_time.to_i - self.created_at.to_time.to_i

    if seconds < 60
      return "刚刚"
    elsif seconds < 3600
      return "%i分钟前" % [seconds / 60]
    elsif seconds < 3600 * 24
      return "%i小时前" % [seconds / 3600]
    else
      return self.created_at.strftime("%Y-%m-%d")
    end
  end
end
