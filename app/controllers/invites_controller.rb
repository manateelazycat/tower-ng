# coding: utf-8
class InvitesController < ApplicationController
  def new
  end

  def create
    params[:members].values().reverse.uniq{|m| m[0]}.reverse.each do |member|
      print("**** ", member[0], " ", member[1], "\n")
    end
  end
end
