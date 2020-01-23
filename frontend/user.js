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

//User content with valid token
function loadUserPage(){
    fetch(`${baseURL}/users`, authHeader)
        .then(parseResponse)
        .then(loadWelcomeMessages)
        .then(console.log)
}

function parseResponse(response){
    return response.json()
}

function loadWelcomeMessages(user){      
    const welcomeMessage = document.getElementById("welcomeMessage")
    welcomeMessage.innerText = `Welcome back, ${user.name}!`
    const stockHeader = document.getElementById("stockHeader")
    
    if(!user.stocks){
        stockHeader.innerText = "You are not currently following any stocks. Please use the Market Parse search to find securities you are interested in following."
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
    })
}




