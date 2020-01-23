class UsersController < ApplicationController
    before_action :authenticate, only: [:index, :destroy]
    before_action :require_login, only: [:index, :destroy]

    def create
        @user = User.new(user_params)

        if @user.save
            render json: { user: @user }
        else
            render json: { error: @user.errors.messages.values.join(", ") }, status: :bad_request
        end
    end

    def index
        render json: @user, include: :stocks
    end

    def destroy 
        @user = User.find(params[:id])
        @user.destroy

        render json: { message: `User: #{@user.name} and followed stocks have been deleted.` }
    end

    def require_login
        if !@user
            render json: { error: "Must be logged in to use Market Parse." }
        end
    end
    
    private

    
    def user_params
        params.require(:user).permit(:name, :email, :password)
    end
end
