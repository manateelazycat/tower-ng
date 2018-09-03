# frozen_string_literal: true

# Mission.
class Mission < ApplicationRecord
  include Hashid::Rails

  belongs_to :mission_list

  has_many :comments, dependent: :destroy
end
