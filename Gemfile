# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.5.1"

gem "bcrypt"
gem "bootsnap", ">= 1.1.0", require: false
gem "bootstrap-datepicker-rails"
gem "bootstrap-sass"
gem "bootstrap-will_paginate", "1.0.0"
gem "browser"
gem "carrierwave"
gem "coffee-rails", "~> 4.2"
gem "hashid-rails"
gem "jbuilder", "~> 2.5"
gem "jquery-rails"
gem "json"
gem "mini_magick"
gem "pry"
gem "puma", "~> 3.11"
gem "rails", "~> 5.2.0"
gem "ruby-pinyin"
gem "sass-rails", "~> 5.0"
gem "solargraph"
gem "sortable-rails"
gem "sqlite3"
gem "turbolinks", "~> 5"
gem "uglifier", ">= 1.3.0"
gem "webpacker", "~> 3.5"

group :development, :test do
  # Call "byebug" anywhere in the code to stop execution and get a debugger console
  gem "byebug", platforms: %i[mri mingw x64_mingw]
end

group :development do
  gem "better_errors"
  gem "binding_of_caller"
  gem "listen", ">= 3.0.5", "< 3.2"
  gem "meta_request"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
  gem "web-console", ">= 3.3.0"
end

group :test do
  gem "capybara", ">= 2.15", "< 4.0"
  gem "chromedriver-helper"
  gem "selenium-webdriver"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[mingw mswin x64_mingw jruby]
