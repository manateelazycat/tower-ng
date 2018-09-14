class AddFinishByToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :finish_by, :integer
  end
end
