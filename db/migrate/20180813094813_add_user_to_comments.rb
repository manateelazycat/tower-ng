class AddUserToComments < ActiveRecord::Migration[5.2]
  def change
    add_column :comments, :user, :string
  end
end
