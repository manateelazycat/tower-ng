class AddSummaryToMissions < ActiveRecord::Migration[5.2]
  def change
    add_column :missions, :summary, :string
  end
end
