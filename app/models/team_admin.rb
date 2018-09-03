class TeamAdmin < ApplicationRecord
  include Hashid::Rails

  belongs_to :team
  belongs_to :user
end
