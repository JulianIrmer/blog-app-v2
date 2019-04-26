// DOM 
const loginBtn = document.querySelector('.login-btn');
const loginForm = document.querySelector('.login');
const loginName = document.querySelector('.name');
const registerForm = document.querySelector('.register');
const registerBtn = document.querySelector('.register-btn');
const show = document.querySelector('.show');
const pwHintRegister = document.querySelector('.pwHintRegister');
const nameHintRegister = document.querySelector('.nameHintRegister');
const pwHintLogin = document.querySelector('.pwHintLogin');
const nameHintLogin = document.querySelector('.nameHintLogin');
const container = document.querySelector('.container');
const container2 = document.querySelector('.container2');
const msgWrapper = document.querySelector('.messenger-wrapper');
const loginWrapper = document.querySelector('.login-wrapper');
// ###################################################################


// global variables
let nameCache = [];
// let pwCheck = false;
let isNameValid = false;
let isEmailValid = false;
let loggedInName = '';
// ###################################################################

checkCookie();

function checkCookie(){
  if(document.cookie.length > 0){
    loginName.value = document.cookie;
  }
}

// switch between login and registration
show.addEventListener('click', () => {
  document.querySelector('.container2').classList.toggle('hidden');
  document.querySelector('.container').classList.toggle('hidden');

  if (show.innerHTML === 'Register') {
    show.innerHTML = 'Login';
  } else {
    show.innerHTML = 'Register';
  };
});

// REGISTRATION REQUEST
registerBtn.addEventListener('click', (event) => {
  event.preventDefault();
  let pwCheck = false;
  let nameCheck = false;
  let emailCheck = false;
  
  // get data from input
  const name = document.querySelector('.register-name').value;
  const email = document.querySelector('.register-email').value;
  const password = document.querySelector('.register-password1').value;
  const password2 = document.querySelector('.register-password2').value;

  // validate passwords
  if (password != password2) {
    pwHintRegister.classList.remove('hidden');
    setTimeout(() => {
      pwHintRegister.classList.add('hidden');
    }, 2000);
    pwCheck = false;
  } else {
    pwCheck = true;
    pwHintRegister.classList.add('hidden');
  };
  // validate name
  if(name.length < 1){
    nameHintRegister.classList.remove('hidden');
    nameHintRegister.innerText = 'You need to enter a username.';
    setTimeout(() => {
      nameHintRegister.classList.add('hidden');
    }, 2000);
    nameCheck = false;
  }
  else{
    nameCheck = true;
  }
  // validate email
  if(email.length < 6){
    nameHintRegister.classList.remove('hidden');
    nameHintRegister.innerText = 'You need to enter a valid email.';
    setTimeout(() => {
      nameHintRegister.classList.add('hidden');
    }, 2000);
    emailCheck = false;
  }
  else{
    emailCheck = true;
  }

  // fill data object
  const data = {
    name,
    email,
    password,
  };
  
  // check all requirements
  if(pwCheck && nameCheck && emailCheck){

    // make post request to api and send the user data
    fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response) => {return response.json()})
    .then((response) => {
      console.log('register...');
      if(response.message == 'success'){
        nameHintRegister.classList.remove('hidden');
        nameHintRegister.style.backgroundColor = 'green';
        nameHintRegister.innerText = 'Registered!'
        setTimeout(() => {
          nameHintRegister.classList.add('hidden');
        }, 2000);

        console.log('User registered');
        window.location.replace('/home');
      }
      else if(response.email == false){
        nameHintRegister.classList.remove('hidden');
        nameHintRegister.innerText = 'Email already in use.';
        console.log('Email already in use');
        setTimeout(() => {
          nameHintRegister.classList.add('hidden');
        }, 2000);
      }
      else if(response.name == false){
        nameHintRegister.classList.remove('hidden');
        nameHintRegister.innerText = 'Name already in use.'
        console.log('Name already in use');
        setTimeout(() => {
          nameHintRegister.classList.add('hidden');
        }, 2000);
      };
    })
    .catch((err) =>{if(err){console.log(err)}});
  };
});

// LOGIN REQUEST
loginBtn.addEventListener('click', (event) => {
event.preventDefault();

const name = document.querySelector('.login-name').value;
const password = document.querySelector('.login-password').value;

const data = {
  name,
  password
};

fetch('/api/login', {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'content-type':'application/json'
  },
})
  .then((response) => {
    return response.json();
  })
  .then(response => {
    console.log(response);
    if(response.login == true){
      window.location.replace('/home');
      console.log('loggin in...');
    }
    else{
      nameHintRegister.classList.remove('hidden');
      nameHintRegister.innerText = 'Username or password wrong.'
      setTimeout(() => {
        nameHintRegister.classList.add('hidden');
      }, 3000);
    };
  })
  .catch((err) => console.error(err));
});
