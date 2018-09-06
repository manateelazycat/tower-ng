class AddAvatarThumbToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :avatar_thumb, :string
  end
end
