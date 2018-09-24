class CreateUserMissions < ActiveRecord::Migration[5.2]
  def change
    create_table :user_missions do |t|
      t.integer :user_id
      t.integer :team_id
      t.integer :mission_id

      t.timestamps
    end
    add_index :user_missions, :user_id
    add_index :user_missions, :team_id
    add_index :user_missions, :mission_id
  end
end
