const worldTradingDataKey = "dYd7owY4SSlfPGRsAcKAszG2hPHL6GWOm3E5Edr68rvplDj5Owimq3eljl0I"
const errorMessage = document.querySelector(".errorMessage")
const baseURL = "http://localhost:3000"
const token = localStorage.getItem("token")
    ? `bearer ${localStorage.getItem("token")}`
    : null

const authHeader = { headers: { "Authorization": token }, }


token ? loadUserPage() : loginPageRedirect()

//Back to login if no valid token
function loginPageRedirect(){
    window.location.href = "/index.html"
}

//Logout and redirect
const logoutButton = document.getElementById("logout")
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token")
    window.location.reload()
})

//User content with valid token
function loadUserPage(){
    fetch(`${baseURL}/users`, authHeader)
        .then(parseResponse)
        .then(loadWelcomeMessages)
        .catch(error => console.log(error))
}

function parseResponse(response){
    return response.json()
}

function loadWelcomeMessages(user){      
    const welcomeMessage = document.getElementById("welcomeMessage")
    welcomeMessage.innerText = `Welcome back, ${user.name}!`
    const stockHeader = document.getElementById("stockHeader")
    
    if(user.stocks.length === 0){
        stockHeader.innerText = "You are not currently following any stocks..."
    } else {
        stockHeader.innerText = "Your followed stocks:"
    }
    loadFollowedStocks(user)
}

function loadFollowedStocks(user){
    user.stocks.map(stock => {
        const stockContainer = document.getElementById("stockContainer")
        const stockCard = document.createElement("div")
        stockCard.className = "stockCard"

        const stockTicker = document.createElement("h3")
        const stockName = document.createElement("h3")
        stockTicker.innerText = stock.ticker
        stockName.innerText = stock.name

        stockContainer.appendChild(stockCard)
        stockCard.append(stockTicker, stockName)

        fetch(`https://api.worldtradingdata.com/api/v1/stock?symbol=${stock.ticker}&api_token=${worldTradingDataKey}`)
            .then(response => response.json())
            .then(stocks => {
        
                const stockPrice = document.createElement("h3")
                stockPrice.className = "stockPrice"
                stockPrice.innerText = `Price: $${parseFloat(stocks.data[0].price).toLocaleString()}`

                const intradayChange = document.createElement("h3")
                intradayChange.className = "intraDayChange"
                intradayChange.innerText = `Intraday Change: ${stocks.data[0].change_pct}%`
                if(parseFloat(stocks.data[0].change_pct) > 0){
                    intradayChange.style.color = "green"
                } else if(parseFloat(stocks.data[0].change_pct) < 0){
                    intradayChange.style.color = "red"
                }
                
                stockCard.append(stockPrice, intradayChange)
                const removeStockButton = document.createElement("input")
                removeStockButton.setAttribute("type", "submit")
                removeStockButton.setAttribute("class", "removeStock")
                removeStockButton.setAttribute("value", "Remove From Watchlist")
                stockCard.appendChild(removeStockButton)

                removeStockButton.addEventListener("click", (event) => {
                    console.log(event.target)
                    event.target.parentNode.remove()
                    fetch(`http://localhost:3000/stocks/${stock.id}`, {
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token
                        }
                    })
                })
            })
    })
}









