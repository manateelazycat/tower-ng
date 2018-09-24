class AddFinishByUserToMission < ActiveRecord::Migration[5.2]
  def change
    add_column :missions, :finish_by_user, :integer
  end
end
