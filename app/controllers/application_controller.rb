class ApplicationController < ActionController::Base
  include SessionsHelper

  before_action :detect_browse_device

  private

  def detect_browse_device
    request.variant = :phone if browser.device.mobile?
  end
end
