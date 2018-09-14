# frozen_string_literal: true

# Team.
class Team < ApplicationRecord
  include Hashid::Rails

  has_many :team_admins
  has_many :users, through: :team_admins

  has_many :projects, dependent: :destroy

  def team_member_list
    # Create memeber array.
    member_array = []

    # Push creator at first.
    team_creator = User.find_by_email(creator)

    member_array.push(user_hashid: team_creator.hashid,
                      name: team_creator.name,
                      pinyin: team_creator.pinyin,
                      photo_url: team_creator.avatar_url)

    # Push team members.
    TeamAdmin.select { |t| t.team_id == id }.each do |team_admin|
      user = User.find_by_id(team_admin.user_id)

      next unless user&.activated?

      member_array.push(user_hashid: user.hashid,
                        name: user.name,
                        pinyin: user.pinyin,
                        photo_url: user.avatar_url)
    end

    member_array
  end
end
