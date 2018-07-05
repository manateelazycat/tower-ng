class AddIconToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :icon, :string
  end
end
