# frozen_string_literal: true

require "ruby-pinyin"

# User.
class User < ApplicationRecord
  include Hashid::Rails

  mount_uploader :photo, PhotoUploader

  has_many :team_admins
  has_many :teams, through: :team_admins

  attr_accessor :remember_token
  attr_accessor :activation_token
  attr_accessor :reset_token
  attr_accessor :avatar_files
  before_save :downcase_email
  before_create :create_activation_digest
  before_create :create_avatar

  # validates :name,
  #           presence: true,
  #           length: {maximum: 100}

  before_save { self.email = email.downcase }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email,
            presence: true,
            length: { maximum: 255 },
            format: { with: VALID_EMAIL_REGEX },
            uniqueness: { case_sensitive: false }

  # has_secure_password
  # validates :password, presence: true, length: {minimum: 6}

  class << self
    def digest(string)
      cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
      BCrypt::Password.create(string, cost: cost)
    end

    def new_token
      SecureRandom.urlsafe_base64
    end
  end

  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?

    BCrypt::Password.new(digest).is_password?(token)
  end

  def update_password(password)
    digest = User.digest(password)
    return false if digest.nil?

    update_attribute(:password_digest, digest)

    true
  end

  def update_pinyin
    update_attribute(:pinyin, PinYin.of_string(name).join(" ").downcase)
  end

  def forget
    update_attribute(:remember_digest, nil)
  end

  def activate
    update_columns(activated: true, activated_at: Time.zone.now)
  end

  def send_activation_email
    UserMailer.account_activation(self).deliver_now
  end

  def create_reset_digest
    self.reset_token = User.new_token
    update_columns(reset_digest: User.digest(reset_token), reset_sent_at: Time.zone.now)
  end

  def send_password_reset_email
    UserMailer.password_reset(self).deliver_now
  end

  def password_reset_expired?
    reset_sent_at < 2.hours.ago
  end

  def downcase_email
    self.email = email.downcase
  end

  def create_activation_digest
    self.activation_token = User.new_token
    self.activation_digest = User.digest(activation_token)
  end

  def generate_avatar_name
    self.avatar_files ||= Dir.entries("app/assets/images/avatar/normal").reject { |f| File.directory? f }

    self.avatar_files.sample
  end

  def create_avatar
    self.avatar = format("avatar/normal/%<name>s", name: generate_avatar_name)
  end

  def avatar_url
    return photo.url if photo?

    return avatar if avatar?

    "avatar/normal/" + self.avatar_files[0]
  end
end
