# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user1 = User.create(name: "Sam", email: "sam@sam.com", password: "sam")
user2 = User.create(name: "Test", email: "test@test.com", password: "test")

stock1 = Stock.create(name: "Apple", ticker: "AAPL", user_id: 1)
stock2 = Stock.create(name: "Tesla", ticker: "TSLA", user_id: 1)