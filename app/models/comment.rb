class Comment < ApplicationRecord
  include Hashid::Rails

  belongs_to :mission
end
