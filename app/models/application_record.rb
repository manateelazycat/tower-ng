# frozen_string_literal: true

# Base abstract record class.
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
end
