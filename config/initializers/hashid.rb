Hashid::Rails.configure do |config|
  # The salt to use for generating hashid. Prepended with table name.
  config.salt = "this is my salt"

  # The minimum length of generated hashids
  config.min_hash_length = 16

  # The alphabet to use for generating hashids
  config.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
end
