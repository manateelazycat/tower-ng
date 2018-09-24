class AddIsOpenToUserMissions < ActiveRecord::Migration[5.2]
  def change
    add_column :user_missions, :is_open, :boolean
  end
end
