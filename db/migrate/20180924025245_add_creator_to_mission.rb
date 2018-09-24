class AddCreatorToMission < ActiveRecord::Migration[5.2]
  def change
    add_column :missions, :creator, :integer
  end
end
