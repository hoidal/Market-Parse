require 'jwt'

class AuthenticationController < ApplicationController
    def login
        @user = User.find_by(email: params[:user][:email])
    
        if !@user
            render json: { error: "Invalid email. Please try again." }, status: :unauthorized
        else
            if !@user.authenticate(params[:user][:password])
                render json: { error: "Incorrect password. Please try again." }, status: :unauthorized
            else
                secret = Rails.application.secrets.secret_key_base
                @token = JWT.encode( { id: @user.id } , secret )
                
                render json: { token: @token }
            end
        end
    end
end
