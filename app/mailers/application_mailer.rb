# frozen_string_literal: true

# Class used to send mail.
class ApplicationMailer < ActionMailer::Base
  default from: 'from@example.com'
  layout 'mailer'
end
