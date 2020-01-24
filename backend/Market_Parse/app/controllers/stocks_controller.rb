class StocksController < ApplicationController
    before_action :authenticate, only: [:create, :destroy]
   
    def create
        @stock = Stock.new(
            name: params[:stock][:name],
            ticker: params[:stock][:ticker],
            user_id: @user.id
        )

        if @stock.save
            render json: { stock: @stock }
        else
            render json: { error: @stock.errors.messages.values.join(", ") }, status: :bad_request
        end
    end

    def destroy 
        @stock = Stock.find(params[:id])
        @stock.destroy

        render json: { message: "Stock '#{@stock.name}' was deleted." }
    end

    private

    def stock_params
        params.require(:stock).permit([:name, :ticker, :user_id])
    end
end
