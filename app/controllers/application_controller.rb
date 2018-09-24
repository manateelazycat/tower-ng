# frozen_string_literal: true

# This is base class for all controllers.
# We add some useful functions, such as detect_browse_device to detect device.
# Don't need write thos common functions in every controller.
class ApplicationController < ActionController::Base

  include SessionsHelper
  include UserMissionsHelper

  before_action :detect_browse_device

  private

  def detect_browse_device
    request.variant = :phone if browser.device.mobile?
  end
end
