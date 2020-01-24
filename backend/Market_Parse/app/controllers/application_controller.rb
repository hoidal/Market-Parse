require 'jwt'

class ApplicationController < ActionController::API
    def authenticate
        secret = Rails.application.secrets.secret_key_base
        token = request.headers["authorization"].split(" ")[1]
        if token
            decoded_token = JWT.decode(request.headers["authorization"].split(" ")[1], secret)[0]
            @user = User.find(decoded_token["id"])
        end
    end
end

