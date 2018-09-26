# frozen_string_literal: true

# Comment controller.
class CommentsController < ApplicationController
  def create
    mission = Mission.find_by_hashid(params[:mission_id])

    comment = mission.comments.create(
      content: params[:content],
      user_id: current_user.id,
      mission_id: params[:mission_id]
    )

    Activity.add_comment_activity(current_user.id, mission.id, params[:content])

    respond_to do |format|
      format.html do
        render "_create_comment",
               locals: { comment: comment },
               layout: false
      end
    end
  end

  def destroy
    comment = Comment.find_by_hashid(params[:id])

    comment&.destroy

    respond_to do |format|
      format.json do
        render json: { status: "destroy" }
      end
    end
  end

  def edit
    comment = Comment.find_by_hashid(params[:id])

    if comment
      comment.content = params[:content]

      comment.save
    end

    respond_to do |format|
      format.json do
        render json: { status: "update" }
      end
    end
  end
end
