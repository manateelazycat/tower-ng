# frozen_string_literal: true

# Team admin, manage relation between team and user.
class TeamAdmin < ApplicationRecord
  include Hashid::Rails

  belongs_to :team
  belongs_to :user
end
