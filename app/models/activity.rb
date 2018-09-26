# frozen_string_literal: true

# Activity.
class Activity < ApplicationRecord
  TYPE_CREATE_MISSION = "CreateMission"
  TYPE_CHANGE_DISTRIBUTOR = "ChangeDistributor"
  TYPE_CANCEL_DISTRIBUTOR = "CancelDistributor"
  TYPE_CHANGE_FINISH_TIME = "ChangeFinishTime"
  TYPE_FINISH = "Finish"
  TYPE_REOPEN = "Reopen"
  TYPE_COMMENT = "Comment"

  class << self
    def add_create_activity(user_id, mission_id)
      if Mission.exists?(mission_id)
        mission = Mission.find(mission_id)

        activity = Activity.new(mission_id: mission_id,
                                user_id: user_id,
                                content_type: TYPE_CREATE_MISSION,
                                content: JSON.generate(mission_name: mission.name))
        activity.save
      else
        printf("add_create_activity can't find mission by mission id '%s'", mission_id)
      end
    end

    def add_change_distributor_activity(user_id, mission_id, distributor)
      if Mission.exists?(mission_id)
        mission = Mission.find(mission_id)

        activity = Activity.new(mission_id: mission_id,
                                user_id: user_id,
                                content_type: TYPE_CHANGE_DISTRIBUTOR,
                                content: JSON.generate(mission_name: mission.name,
                                                       distributor: distributor))
        activity.save
      else
        printf("add_change_distributor_activity can't find mission by mission id '%s'", mission_id)
      end
    end

    def add_cancel_distributor_activity(user_id, mission_id, distributor)
      if Mission.exists?(mission_id)
        mission = Mission.find(mission_id)

        activity = Activity.new(mission_id: mission_id,
                                user_id: user_id,
                                content_type: TYPE_CANCEL_DISTRIBUTOR,
                                content: JSON.generate(mission_name: mission.name,
                                                       distributor: distributor))
        activity.save
      else
        printf("add_cancel_distributor_activity can't find mission by mission id '%s'", mission_id)
      end
    end

    def add_change_finish_time_activity(user_id, mission_id, current_time, new_time)
      return if current_time == new_time

      if Mission.exists?(mission_id)
        mission = Mission.find(mission_id)

        activity = Activity.new(mission_id: mission_id,
                                user_id: user_id,
                                content_type: TYPE_CHANGE_FINISH_TIME,
                                content: JSON.generate(mission_name: mission.name,
                                                       current_time: current_time,
                                                       new_time: new_time))
        activity.save
      else
        printf("add_change_finish_time_activity can't find mission by mission id '%s'", mission_id)
      end
    end

    def add_finish_activity(user_id, mission_id)
      if Mission.exists?(mission_id)
        mission = Mission.find(mission_id)

        activity = Activity.new(mission_id: mission_id,
                                user_id: user_id,
                                content_type: TYPE_FINISH,
                                content: JSON.generate(mission_name: mission.name))
        activity.save
      else
        printf("add_finish_activity can't find mission by mission id '%s'", mission_id)
      end
    end

    def add_reopen_activity(user_id, mission_id)
      if Mission.exists?(mission_id)
        mission = Mission.find(mission_id)

        activity = Activity.new(mission_id: mission_id,
                                user_id: user_id,
                                content_type: TYPE_REOPEN,
                                content: JSON.generate(mission_name: mission.name))
        activity.save
      else
        printf("add_reopen_activity can't find mission by mission id '%s'", mission_id)
      end
    end

    def add_comment_activity(user_id, mission_id, comment)
      if Mission.exists?(mission_id)
        mission = Mission.find(mission_id)

        activity = Activity.new(mission_id: mission_id,
                                user_id: user_id,
                                content_type: TYPE_COMMENT,
                                content: JSON.generate(mission_name: mission.name,
                                                       comment: comment))
        activity.save
      else
        printf("add_comment_activity can't find mission by mission id '%s'", mission_id)
      end
    end
  end

  def log_info
    return unless Mission.exists?(mission_id)

    mission = Mission.find(mission_id)
    json_info = JSON.parse(content)

    log_info = case content_type
               when TYPE_CREATE_MISSION then
                 format("创建了任务: ")
               when TYPE_CHANGE_DISTRIBUTOR then
                 format("将任务指派给了 %<distributor>s: ", distributor: User.find(json_info["distributor"]).name)
               when TYPE_CANCEL_DISTRIBUTOR then
                 format("取消了 %<distributor>s 的任务: ", distributor: User.find(json_info["distributor"]).name)
               when TYPE_CHANGE_FINISH_TIME then
                 current_time = json_info["current_time"].nil? ? "没有截止时间" : DateTime.parse(json_info["current_time"]).strftime("%Y-%m-%d")
                 new_time = json_info["new_time"].nil? ? "没有截止时间" : DateTime.parse(json_info["new_time"]).strftime("%Y-%m-%d")

                 format("将任务完成时间从 %<current_time>s 修改为 %<new_time>s: ",
                        user_name: User.find(user_id).name,
                        current_time: current_time,
                        new_time: new_time)
               when TYPE_FINISH then
                 format("完成了任务: ")
               when TYPE_REOPEN then
                 format("重新打开了任务: ")
               when TYPE_COMMENT then
                 format("回复了任务: ")
               end

    { log_type: "activity_line",
      log_date: created_at,
      log_info: log_info,
      user_id: user_id,
      created_time: created_at,
      mission_hashid: mission.hashid,
      mission_project_hashid: mission.project_hashid,
      mission_name: json_info["mission_name"],
      project_name: mission.project_name,
      comment: json_info["comment"]}
  end
end
