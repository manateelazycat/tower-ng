class RemoveCreatedMissionsFromUser < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :created_missions
  end
end
