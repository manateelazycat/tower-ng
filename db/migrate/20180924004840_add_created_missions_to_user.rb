class AddCreatedMissionsToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :created_missions, :integer, array: true, default: []
  end
end
