# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "homes#new"
  get "sign_up", to: "users#new"
  post "sign_up", to: "users#create"
  get "sign_in", to: "sessions#new"
  post "sign_in", to: "sessions#create"
  delete "sign_out", to: "sessions#destroy"

  resources :users do
    resources :settings
  end

  resources :teams, shallow: true do
    resources :projects
    resources :members
  end

  resources :account_activations, only: [:edit]
  resources :password_resets, only: %i[new create edit update]

  resources :joins, only: %i[new create]

  resources :projects do
    resources :mission_lists
    resources :missions do
      resources :comments
    end
  end
end
