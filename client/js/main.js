//HTML ELEMENTS
const postForm = document.querySelector('.post-form');
const loginForm = document.querySelector('.login');
const registerForm = document.querySelector('.register');
const postsElement = document.querySelector('.posts');
const header = document.querySelector('header');
const wrapper = document.querySelector('.wrapper');
const center = document.querySelector('.center');
const center2 = document.querySelector('.center2');
const popup = document.querySelector('.popup');
const send = document.querySelector('.send-btn');
const login = document.querySelector('.login-li');
const register = document.querySelector('.register-li');
const logout = document.querySelector('.logout-li');

//GLOBAL VARIABLES
let currentUser;
let isLoggedIn = false;

//API ROUTES
// const API_GET_ALL = 'http://localhost:5000/api';
// const API_SEND = 'http://localhost:5000/api/send';
// const API_DELETE_ALL = 'http://localhost:5000/api/delete';
// const API_DELETE_ID = 'http://localhost:5000/api/delete/';
// const API_LOGIN = 'http://localhost:5000/api/login';
// const API_REGISTER = 'http://localhost:5000/api/register';
// const API_CHECK_SESSION = 'http://localhost:5000/api/checksession';

const API_GET_ALL = '/api';
const API_SEND = '/api/send';
const API_DELETE_ALL = '/api/delete';
const API_DELETE_ID = '/api/delete/';
const API_LOGIN = '/api/login';
const API_REGISTER = '/api/register';
const API_CHECK_SESSION = '/api/checksession';

//get all posts from mongodb
window.onload = () => {
  checkSession();
  loadAllPosts();
};

// check if user if logged in
function checkSession() {
  fetch(API_CHECK_SESSION)
    .then(response => {
      return response.json()
    })
    .then(response => {
      currentUser = response.username;
      if (response.isLoggedIn) {
        login.innerHTML = 'Hello, ' + response.username + '!';
        register.classList.add('hidden');
        isLoggedIn = true;
        login.style.pointerEvents = 'none';
      } else {
        logout.classList.add('hidden');
        postForm.classList.add('hidden');
      };
    })
    .catch(err => console.log(err));
};

//create a post
postForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.querySelector('#title').value;
  const content = document.querySelector('#content').value;
  const time = new Date().toLocaleTimeString();
  const date = new Date().toLocaleDateString();
  const author = currentUser;
  let id;
  let isContent = false;
  let isTitle = false;

  if (title.length > 0) {
    isTitle = true;
  };

  if (content.length > 0) {
    isContent = true;
  };

  const data = {
    title,
    content,
    id,
    time,
    date,
    author
  };


  if (isContent && isTitle) {
    //save a post to mongodb
    fetch(API_SEND, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        }
      })
      .catch(err => console.log(err));
  };
  //reload the window
  // window.location.reload();
  loadAllPosts();
  document.querySelector('#title').value = '';
  document.querySelector('#content').value = '';
});


//create new html elements for every element in the array
function loadAllPosts() {
  postsElement.innerHTML = '';
  fetch(API_GET_ALL)
    .then((response) => {
      return response.json();
    })
    .then((allPosts) => {
      allPosts.reverse();
      allPosts.forEach(post => {
        //create a new div for every post
        const div = document.createElement('div');
        div.className = 'post';

        //add the title
        const title = document.createElement('h2');
        title.textContent = post.title;
        title.className = 'post-title';

        //add the content
        const content = document.createElement('p');
        content.textContent = post.content;
        content.className = 'post-content';

        //add the author
        const author = document.createElement('p');
        author.textContent = 'written by ' + post.author;
        author.className = 'post-author';

        //add the time
        const time = document.createElement('small');
        time.textContent = post.date;
        time.className = 'post-date';

        //add the date
        const date = document.createElement('small');
        date.textContent = post.time.substring(0, 5);
        date.className = 'post-date';


        //add all new elements to the div and add the div to the posts-div
        div.appendChild(title);
        div.appendChild(content);
        div.appendChild(author);
        div.appendChild(time);
        div.appendChild(date);

        //add delete button
        if (currentUser == post.author) {
          const delBtn = document.createElement('div');
          delBtn.textContent = 'X';
          delBtn.className = 'delete-btn';
          delBtn.id = post.id;

          //add the 'delete a single post'-function
          delBtn.addEventListener('click', (delBtn) => {
            let postid = delBtn.path[0].id;
            console.log(postid);
            fetch(API_DELETE_ID + postid, {
              method: 'POST',
              headers: {
                'content-type': 'application/json'
              }
            });
            //make sure the server has enough time to fetch the new data
            setTimeout(loadAllPosts, 500);
          });
          div.appendChild(delBtn);
        };

        // if(isLoggedIn){
        //   const addCommentBtn = document.createElement('div');
        //   addCommentBtn.textContent = `Add comment(${post.comments.length})`;
        //   addCommentBtn.className = 'add-comment-btn';
        //   addCommentBtn.id = post.uid;

        //   addCommentBtn.addEventListener('click', (addCommentBtn) => {
        //     let id = addCommentBtn.path[0].id;
        //     console.log(id);
        //   });
        //   div.appendChild(addCommentBtn);
        // };
        postsElement.appendChild(div);
      });
    });
};

// login button
login.addEventListener('click', () => {
  if (login.textContent == 'Login') {
    window.location.replace('/home');
  };
});

register.addEventListener('click', () => {
  window.location.replace('/login');
});

// logout button
logout.addEventListener('click', () => {
  fetch('/api/logout');
  window.location.replace('/');
});

function editor() {
  document.querySelector('#title').classList.remove('hidden2');
  document.querySelector('#content').classList.remove('hidden2');
  document.querySelector('.post-form').style.height = 200 + 'px';
  send.style.transform = 'translateY(0px)';
  send.innerHTML = 'Send';
};