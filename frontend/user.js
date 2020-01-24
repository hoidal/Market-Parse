const worldTradingDataKey = "dYd7owY4SSlfPGRsAcKAszG2hPHL6GWOm3E5Edr68rvplDj5Owimq3eljl0I"
const errorMessage = document.querySelector(".errorMessage")
const baseURL = "http://localhost:3000"
const token = localStorage.getItem("token")
    ? `bearer ${localStorage.getItem("token")}`
    : null

const authHeader = { headers: { "Authorization": token }, }
const stockContainer = document.getElementById("stockContainer")
const stockCardDiv = document.getElementById("userStockCardDiv")
const stockHeader = document.getElementById("stockHeader")


token ? loadUserPage() : loginPageRedirect()

//Back to login if no valid token
function loginPageRedirect(){
    window.location.href = "index.html"
}

//Logout and redirect
const logoutButton = document.getElementById("logout")
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token")
    window.location.reload()
})

//User content with valid token
function loadUserPage(){
    while(userStockCardDiv.hasChildNodes()){
    userStockCardDiv.removeChild(userStockCardDiv.lastChild)
    }

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
    
    if(user.stocks.length === 0){
        stockHeader.innerText = "You are not currently following any stocks..."
    } else {
        stockHeader.innerText = "Your followed stocks:"
    }
    stockContainer.prepend(stockHeader)
    loadFollowedStocks(user)
}

function loadFollowedStocks(user){
    user.stocks.map(stock => {
        const stockCard = document.createElement("div")
        stockCard.className = "stockCard"

        const stockTicker = document.createElement("h2")
        const stockName = document.createElement("h2")
        stockTicker.innerText = stock.ticker
        stockName.innerText = stock.name

        userStockCardDiv.appendChild(stockCard)
        stockCard.append(stockTicker, stockName)

        fetch(`https://api.worldtradingdata.com/api/v1/stock?symbol=${stock.ticker}&api_token=${worldTradingDataKey}`)
            .then(response => response.json())
            .then(stocks => {
        
                const stockPrice = document.createElement("h3")
                stockPrice.className = "stockPrice"
                stockPrice.innerText = `Price: $${parseFloat(stocks.data[0].price).toFixed(2).toLocaleString()}`

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
                    event.target.parentNode.remove()
                    fetch(`${baseURL}/stocks/${stock.id}`, {
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


//search functionality
const searchForm = document.getElementById("stockSearchForm")
const searchStockCardDiv = document.getElementById("searchStockCardDiv")

searchForm.addEventListener("submit", startSearch)

function startSearch(event){
    event.preventDefault()
    const searchRequest = getSearchParams(event.target)

    while(searchStockCardDiv.hasChildNodes()){
    searchStockCardDiv.removeChild(searchStockCardDiv.lastChild)
    }

    stockHeader.innerText = "Search results..."
    userStockCardDiv.style.display = "none"
    searchStockCardDiv.style.display = "flex"
    displayResults(searchRequest)
}

function getSearchParams(form){
    const formData = new FormData(form)
    return formData.get("name")     
}

function displayResults(searchRequest){
    fetch(`https://api.worldtradingdata.com/api/v1/stock_search?search_term=${searchRequest}&limit=10&page=1&api_token=${worldTradingDataKey}`)
    .then(response => response.json())
    .then(searchResults => searchResults.data.map(stock => {
        const stockCard = document.createElement("div")
        stockCard.className = "stockCard"

        const stockCardFront = document.createElement("div")
        stockCardFront.className = "stock_card_front"
        const stockCardBack = document.createElement("div")
        stockCardBack.className = "stock_card_back"

        const tickerSymbol = document.createElement("h3")
        const stockName = document.createElement("h2")
        const stockCurrency = document.createElement("h5")
        const stockPrice = document.createElement ("h3")
        const stockExchange = document.createElement("h5")

        tickerSymbol.innerText = stock.symbol
        stockName.innerText = stock.name
        stockCurrency.innerText = `Currency: ${stock.currency}`
        stockPrice.innerText = `Price: $${parseFloat(stock.price).toLocaleString()}`
        stockExchange.innerText = `Exchange: ${stock.stock_exchange_short}`

        stockCardFront.append(tickerSymbol, stockName, stockPrice, stockCurrency, stockExchange)
        stockCard.append(stockCardFront)
        searchStockCardDiv.appendChild(stockCard)

        stockCardFront.addEventListener('click', (event) => {
            const stockCardBack = document.createElement("div")
            stockCardBack.className = "stock_card_back"
            stockCardFront.style.display = 'none'
            displayMoreInfo(stock.symbol, stockCard, stockCardBack)
        })
    }))
    .then(error => console.log(error))
}

function displayMoreInfo(ticker, stockCard, stockCardBack){
    fetch(`https://api.worldtradingdata.com/api/v1/stock?symbol=${ticker}&api_token=${worldTradingDataKey}`)
    .then(response => response.json())
    .then(stockData => {
        const ticker = document.createElement("h3")
        const name = document.createElement("h2")
        const price = document.createElement("h3")
        const currency = document.createElement("h5")
        const priceOpen = document.createElement("h5")
        const dayHigh = document.createElement("h5")
        const dayLow = document.createElement("h5")
        const yearHigh = document.createElement("h5")
        const yearLow = document.createElement("h5")
        const dayPercentChange = document.createElement("h5")
        const marketCap = document.createElement("h5")
        const volume = document.createElement("h5")
        const volumeAvg = document.createElement("h5")
        const shares = document.createElement("h5")
        const stockExchange = document.createElement("h5")
        
        ticker.innerText = `${stockData.data[0].symbol}`
        name.innerText = `${stockData.data[0].name}`
        currency.innerText = `Currency: ${stockData.data[0].currency}`
        price.innerText = `Price: $${parseFloat(stockData.data[0].price).toLocaleString()}`
        priceOpen.innerText = `Open Price: $${parseFloat(stockData.data[0].price_open).toLocaleString()}`
        dayHigh.innerText = `Today's High: $${parseFloat(stockData.data[0].day_high).toLocaleString()}`
        dayLow.innerText = `Today's Low: $${parseFloat(stockData.data[0].day_low).toLocaleString()}`
        yearHigh.innerText = `52-Week High: $${parseFloat(stockData.data[0]["52_week_high"]).toLocaleString()}`
        yearLow.innerText = `52-Week Low: $${parseFloat(stockData.data[0]["52_week_low"]).toLocaleString()}`
        dayPercentChange.innerText = `Intraday Change: ${stockData.data[0].change_pct}%`
        marketCap.innerText = `Market Cap: $${parseInt(stockData.data[0].market_cap).toLocaleString()}`
        volume.innerText = `Volume: ${parseInt(stockData.data[0].volume).toLocaleString()}`
        volumeAvg.innerText = `Volume Avg.: ${parseInt(stockData.data[0].volume_avg).toLocaleString()}`
        shares.innerText = `Shares: ${parseInt(stockData.data[0].shares).toLocaleString()}`
        stockExchange.innerText = `Exchange: ${stockData.data[0].stock_exchange_short}`

        const addToWatchlistButton = document.createElement("input")
        addToWatchlistButton.setAttribute("type", "submit")
        addToWatchlistButton.setAttribute("class", "followStock")
        addToWatchlistButton.setAttribute("value", "Add To Watchlist")

        stockCardBack.append(
            ticker,
            name,
            price,
            currency,
            stockExchange,
            priceOpen,
            dayHigh,
            dayLow,
            yearHigh,
            yearLow,
            dayPercentChange,
            marketCap,
            volume,
            volumeAvg,
            shares,
            addToWatchlistButton
        )
        stockCard.appendChild(stockCardBack)

        stockCardBack.addEventListener('click', (event) => {
            if(event.target != addToWatchlistButton){
                stockCardBack.style.display = 'none'
                stockCardBack.parentElement.children.item(0).style.display = 'block'
            }
        })

        addToWatchlistButton.addEventListener("click", (event) => {
            postStock(event.target)
        })
    })
}

function postStock(selectedStock){
    const cardInfo = selectedStock.parentNode
    const ticker = cardInfo.children[0].innerText
    const name = cardInfo.children[1].innerText
    fetch(`${baseURL}/stocks`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            stock: {
                name,
                ticker
            }
        })
    })
    .then(response => response.json())
    .then(window.location.reload())
}












