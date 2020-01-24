const signUpForm = document.getElementById("signUpForm")
const logInForm = document.getElementById("logInForm")
const errorMessage = document.querySelector(".errorMessage")
const baseURL = "http://localhost:3000"

const token = localStorage.getItem("token") ? `bearer ${localStorage.getItem("token")}` : null
token ? redirectToUserPage() : displaySignUp()


//welcome message and login prompt
function displaySignUp(){
    const newOrExistingUserDiv = document.getElementById("newOrExistingUserDiv")
    const newUserButton = document.getElementById("newUser")
    const existingUserButton = document.getElementById("existingUser")
    const backButton = document.createElement("button")
    backButton.innerText = "Back"
    newOrExistingUserDiv.addEventListener('click', (event) => {
        if(event.target === newUserButton){
            newOrExistingUserDiv.style.display = "none"
            signUpDiv.style.display = "block"
            signUpDiv.appendChild(backButton)
            backButton.addEventListener("click", goBack)
        } else if (event.target === existingUserButton){
            newOrExistingUserDiv.style.display = "none"
            loginDiv.style.display = "block"
            loginDiv.appendChild(backButton)
            backButton.addEventListener("click", goBack)
        } 
    })
}

function goBack(event){
    event.target.parentNode.style.display = "none"
    newOrExistingUserDiv.style.display = "block"
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
    .catch(showError)
}

function newUserInfo(form){
    const formData = new FormData(form)
    if(formData.get("password") !== formData.get("passwordConfirm")) {
        const passwordError = document.getElementById("passwordError")
        passwordError.innerText = "Passwords do not match. Please try again."
    } else {
        return {
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password")
        }
    }
}

function redirectToLogin(){
    loginDiv.style.display = "block"
    signUpDiv.style.display = "none"
    const loginPrompt = document.createElement("h4")
    loginPrompt.innerText = "Thank you for signing up. Please sign in to begin using Market Parse."
    loginDiv.appendChild(loginPrompt)
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

function redirectToUserPage(){
    window.location.href = "/user.html"
}

//shared Sign Up and Sign In functions
function checkForError(response){
    return !response.ok 
        ? response.json().then(({error}) => {
            throw new Error(error)
        })
        : response.json()
}

function showError(error){
    errorMessage.innerText = error
}