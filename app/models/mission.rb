class Mission < ApplicationRecord
  include Hashid::Rails
  
  belongs_to :mission_list
end
