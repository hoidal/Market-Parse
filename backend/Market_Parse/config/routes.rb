Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :stocks, only: [:create, :destroy]
  resources :users, only: [:index, :create, :show, :destroy]
  post "login", to: "authentication#login"
end
