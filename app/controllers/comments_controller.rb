class CommentsController < ApplicationController
  def create
    mission = Mission.find_by_hashid(params[:mission_id])

    comment = mission.comments.create(
      content: params[:content],
      user_id: current_user.id,
      mission_id: params[:mission_id]
    )

    respond_to do |format|
      format.html {render '_create_comment',
                          :locals => {:comment => comment},
                          :layout => false}
    end
  end

  def destroy
    comment = Comment.find_by_hashid(params[:id])

    if comment then
      comment.destroy
    end

    respond_to do |format|
      format.json {
        render :json => {
                 :status => "destroy",
               }}
    end
  end
end
