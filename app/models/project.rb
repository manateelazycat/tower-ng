class Project < ApplicationRecord
  include Hashid::Rails
  
  belongs_to :team
end
