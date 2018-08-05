class Project < ApplicationRecord
  include Hashid::Rails

  belongs_to :team

  has_many :mission_lists, dependent: :destroy
end
