# frozen_string_literal: true

# Handle user's photo.
class PhotoUploader < CarrierWave::Uploader::Base
  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  storage :file
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # Provide a default URL as a default if there hasn"t been a file uploaded:
  # def default_url(*args)
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join("_"))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join("_")
  # end

  process clip_photo: [48, 48]
  process round: []

  version :thumb_24 do
    process clip_photo: [24, 24]
    process round: []
  end

  def clip_photo(width, height, gravity = "Center", combine_options: {})
    manipulate! do |img|
      cols, rows = img[:dimensions]
      img.combine_options do |cmd|
        if width != cols || height != rows
          scale_x = width / cols.to_f
          scale_y = height / rows.to_f
          if scale_x >= scale_y
            cols = (scale_x * (cols + 0.5)).round
            rows = (scale_x * (rows + 0.5)).round
            cmd.resize cols.to_s
          else
            cols = (scale_y * (cols + 0.5)).round
            rows = (scale_y * (rows + 0.5)).round
            cmd.resize "x#{rows}"
          end
        end
        cmd.gravity gravity
        cmd.background "rgba(255,255,0,1.0)"
        cmd.extent "#{width}x#{height}" if cols != width || rows != height
        append_combine_options cmd, combine_options
      end
      img = yield(img) if block_given?
      img
    end
  end

  def round
    manipulate! do |img|
      img.format "png"

      width = img[:width] - 2
      radius = width / 2

      mask = ::MiniMagick::Image.open img.path
      mask.format "png"

      mask.combine_options do |m|
        m.alpha "transparent"
        m.background "none"
        m.fill "white"
        m.draw format("roundrectangle 1, 1, %<width>s, %<width>s, %<radius>s, %<radius>s", width: width, radius: radius)
      end

      img.composite(mask, "png") do |i|
        i.alpha "set"
        i.compose "DstIn"
      end
    end
  end

  # Process files as they are uploaded:
  # process scale: [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
  # version :thumb do
  #   process resize_to_fit: [50, 50]
  # end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  # def extension_whitelist
  #   %w(jpg jpeg gif png)
  # end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  # def filename
  #   "something.jpg" if original_filename
  # end
end
