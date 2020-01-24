const signUpForm = document.getElementById("signUpForm")
const logInForm = document.getElementById("logInForm")
const errorMessage = document.getElementById("login-error-message")
const errorMessageSignUp = document.getElementById("signup-error-message")
const signUpDiv = document.getElementById("signUpDiv")
const loginDiv = document.getElementById("loginDiv")
const loginPrompt = document.createElement("h4")
const signUpBackButton = document.getElementById("signup-back-button")
const loginBackButton = document.getElementById("login-back-button")
const passwordError = document.getElementById("password-error")
const baseURL = "http://localhost:3000"

const token = localStorage.getItem("token") ? `bearer ${localStorage.getItem("token")}` : null
token ? redirectToUserPage() : displaySignUp()


//welcome message and login prompt
function displaySignUp(){
    const newOrExistingUserDiv = document.getElementById("newOrExistingUserDiv")
    const newUserButton = document.getElementById("newUser")
    const existingUserButton = document.getElementById("existingUser")

    newOrExistingUserDiv.addEventListener('click', (event) => {
        if(event.target === newUserButton){
            newOrExistingUserDiv.style.display = "none"
            signUpDiv.style.display = "block"
            signUpBackButton.addEventListener("click", goBack)
        } else if (event.target === existingUserButton){
            newOrExistingUserDiv.style.display = "none"
            loginDiv.style.display = "block"
            loginBackButton.addEventListener("click", goBack)
        } 
    })
}

function goBack(event){
    event.target.parentNode.style.display = "none"
    newOrExistingUserDiv.style.display = "block"
    loginPrompt.innerText = ""
    
    passwordError.innerText = ""
    errorMessageSignUp.innerText = ""
    errorMessage.innerText = ""
    signUpForm.reset()
    logInForm.reset()
}


//Sign Up
signUpForm.addEventListener("submit", signUp)

function signUp(event){
    event.preventDefault()

    const user = newUserInfo(event.target)

    fetch(`${baseURL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user })
    })
    .then(checkForError)
    .then(redirectToLogin)
    .catch(displayError)
}

function newUserInfo(form){
    const formData = new FormData(form)
    if(formData.get("password") !== formData.get("passwordConfirm")) {
        passwordError.innerText = "Passwords do not match. Please try again."
    } else {
        return {
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password")
        }
    }
}

function displayError(error){
    errorMessageSignUp.innerText = error
}

function redirectToLogin(){
    loginDiv.style.display = "block"
    signUpDiv.style.display = "none"
    
    loginPrompt.innerText = "Thank you for signing up. Please sign in to begin using Market Parse."
    loginDiv.appendChild(loginPrompt)

    loginBackButton.addEventListener("submit", (event) => {
        goBack(event)
    })
}


//Log In
logInForm.addEventListener("submit", login)

function login(event){
    event.preventDefault()

    const user = getUser(event.target)
    const loginAction = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user }),
    }

    fetch(`${baseURL}/login`, loginAction)
        .then(checkForError)
        .then(generateToken)
        .then(redirectToUserPage)
        .catch(showError)
}

function getUser(form){
    const formData = new FormData(form)
    return {
            email: formData.get("email"),
            password: formData.get("password")
        }
}

function generateToken({ token }){
    localStorage.setItem("token", token)
    console.log(token)
}

function showError(error){
    errorMessage.innerText = error
}

function redirectToUserPage(){
    window.location.href = "/user.html"
}

//shared Sign Up and Sign In function
function checkForError(response){
    return !response.ok 
        ? response.json().then(({error}) => {
            throw new Error(error)
        })
        : response.json()
}