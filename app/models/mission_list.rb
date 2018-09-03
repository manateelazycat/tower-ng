# frozen_string_literal: true

# Mission list.
class MissionList < ApplicationRecord
  include Hashid::Rails

  belongs_to :project

  has_many :missions, dependent: :destroy
end
