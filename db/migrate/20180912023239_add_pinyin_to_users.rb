class AddPinyinToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :pinyin, :string
  end
end
