class RenameActivityTypeColumn < ActiveRecord::Migration[5.2]
  def change
    rename_column :activities, :type, :content_type
  end
end
