class RemoveAvatarThumbFromUsers < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :avatar_thumb, :string
  end
end
