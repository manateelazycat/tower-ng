class RemoveUserFromComments < ActiveRecord::Migration[5.2]
  def change
    remove_column :comments, :user, :string
  end
end
