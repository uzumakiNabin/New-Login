const loginContainer = document.getElementById('login-container'),
        signinContainer = document.getElementById('signin-container'),
        switchLink = document.querySelectorAll('.switch-link'),
        notification = document.getElementById('notification'),
        body = document.getElementsByTagName('body');

const loginForm = document.getElementById('login-form'),
        username = document.getElementById('username'),
        password = document.getElementById('password');

const signinForm = document.getElementById('signin-form'),
        fullName = document.getElementById('name'),
        createUsername = document.getElementById('create-username'),
        address = document.getElementById('address'),
        email = document.getElementById('email'),
        createPass = document.getElementById('create-pass'),
        confirmPass = document.getElementById('confirm-pass');

const credentials = localStorage.getItem('credentials') === null ? [] : JSON.parse(localStorage.getItem('credentials'));
let currentUser;

//Login
function validateLogin(){
    if(username.value.trim() === ''){
        showError(username, 'Please enter username.');
        return false;
    } else {
        const index = credentials.findIndex(credential => credential.username === username.value.trim());
        if(index === -1){
            showError(username, 'Username not found. Please create account first.');
            return false;
        } else{
            hideError(username);
            currentUser = credentials[index];
            if(password.value.trim() === currentUser.password){
                hideError(password);
                return true;
            } else {
                showError(password, 'Wrong password.');
                password.focus();
                return false;
            }
        }
    }
}

//Signin
function validateSignin(){
    if(fullName.value.trim() === ''){
        showError(fullName, 'Name is required');
        fullName.focus();
        return false;
    } else {
        hideError(fullName);
    }
    if(createUsername.value.trim() === ''){
        showError(createUsername, 'Username is required');
        createUsername.focus();
        return false;
    } else if (createUsername.value.trim().length < 5){
        showError(createUsername, 'Username must be atleast 5 characters long');
        createUsername.focus();
        return false;
    } else if(usernameExist(createUsername)){
        showError(createUsername, 'Username already exists. Enter new one.');
        createUsername.focus();
        return false;
    } else {
        hideError(createUsername);
    }
    if(email.value.trim() === ''){
        showError(email, 'Email is required');
        email.focus();
        return false;
    } else if (!isValidEmail(email)){
        showError(email, "Email is not valid");
        email.focus();
        return false;
    } else if (emailExist(email)){
        showError(email, 'Email already used');
        email.focus();
        return false;
    } else {
        hideError(email);
    }
    if(createPass.value.trim() === ''){
        showError(createPass, 'Password is required');
        return false;
    } else if (createPass.value.trim().length < 6){
        showError(createPass, 'Password must be atleast 6 characters long');
        return false;
    } else {
        hideError(createPass);
    }
    if(confirmPass.value.trim() !== createPass.value.trim()){
        showError(confirmPass, 'Please confirm above password');
        return false;
    } else {
        hideError(confirmPass);
    }
    return true;
}

//Save into local storage
function saveCredentials(){
    credentials.push({username: createUsername.value, password: createPass.value, name: fullName.value, address: address.value, email: email.value});
    console.log(credentials);
    localStorage.setItem('credentials', JSON.stringify(credentials));
}

//Show error in DOM
function showError(input, message){
    const formItem = input.parentElement.querySelector('small');
    formItem.style.display = 'block';
    formItem.innerText = message;
}

function hideError(input){
    input.parentElement.querySelector('small').style.display = 'none';
}

//Check if already exists
function usernameExist(uname){
    const t1 = credentials.findIndex(credential => credential.username === uname.value.trim());
    if(t1 === -1){
        return false;
    } else {
        return true;
    }
}

function emailExist(email){
    const t2 = credentials.findIndex(credential => credential.email === email.value.trim());
    if(t2 === -1){
        return false;
    } else {
        return true;
    }
}

//Email validation check
function isValidEmail(input){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())){
        return true;
    } else {
        return false;
    }
}

//Show notification
function showNotification(){
    notification.classList.add('pop-in');

    setTimeout(() => {
        notification.classList.remove('pop-in');
    }, 3000);
}

//Event Listeners
switchLink.forEach((node) => node.addEventListener('click', () => {
    if(signinContainer.classList.contains('hidden')){
        loginContainer.classList.add('hidden');
        signinContainer.classList.remove('hidden');
    } else {
        signinContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }
}));

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(validateLogin()){
        loginContainer.classList.add('hidden');
        signinContainer.classList.add('hidden');
        document.getElementsByTagName('h1')[0].innerText = `Welcome, ${currentUser.name}`;
    };
})

signinForm.addEventListener('submit', (e) => {
    console.log('clicked');
    e.preventDefault();
    if(validateSignin()){        
        saveCredentials();
        username.value = '';
        password.value = '';
        fullName.value = '';
        createUsername.value = '';
        address.value = '';
        email.value = '';
        createPass.value = '';
        confirmPass.value = '';
        signinContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        showNotification();
    }
})