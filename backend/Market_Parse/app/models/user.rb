class User < ApplicationRecord
  has_secure_password
  has_many :stocks, dependent: :destroy

  validates :email, presence: true
  validates :email, :uniqueness => {:case_sensitive => false}
  validates :password, presence: true
end
