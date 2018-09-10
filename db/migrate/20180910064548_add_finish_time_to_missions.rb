class AddFinishTimeToMissions < ActiveRecord::Migration[5.2]
  def change
    add_column :missions, :finish_time, :datetime
  end
end
