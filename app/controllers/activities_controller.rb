# frozen_string_literal: true

# Control activities
class ActivitiesController < ApplicationController
  def index
    activity_items = Activity.all.reverse

    @activities = []

    current_day = ""
    current_project_name = ""
    today = DateTime.now.strftime("%Y-%m-%d")

    activity_items.each do |activity_item|
      log_info = activity_item.log_info

      if log_info
        log_day = log_info[:created_time].strftime("%Y-%m-%d")

        if current_day != log_day
          current_day = log_day
          current_project_name = log_info[:project_name]
          @activities.push(log_type: "day_line",
                           log_day: log_day == today ? "今天" : log_day,
                           mission_project_hashid: log_info[:mission_project_hashid],
                           project_name: log_info[:project_name])
        elsif current_project_name != log_info[:project_name]
          current_project_name = log_info[:project_name]
          @activities.push(log_type: "project_line",
                           mission_project_hashid: log_info[:mission_project_hashid],
                           project_name: log_info[:project_name])
        end

        @activities.push(log_info)
      end
    end

    @activities
  end
end
