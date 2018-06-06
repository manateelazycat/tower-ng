class CreateTeamAdmins < ActiveRecord::Migration[5.2]
  def change
    create_table :team_admins do |t|
      t.references :team, foreign_key: true
      t.references :user, foreign_key: true
      t.boolean :is_administrator

      t.timestamps
    end
  end
end
