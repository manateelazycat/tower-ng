class CreateProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :projects do |t|
      t.text :name
      t.references :team, foreign_key: true

      t.timestamps
    end
  end
end
