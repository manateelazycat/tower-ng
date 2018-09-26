class AddTypeToActivity < ActiveRecord::Migration[5.2]
  def change
    add_column :activities, :type, :string
  end
end
