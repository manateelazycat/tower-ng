class CreateActivities < ActiveRecord::Migration[5.2]
  def change
    create_table :activities do |t|
      t.integer :mission_id
      t.string :content

      t.timestamps
    end
  end
end
