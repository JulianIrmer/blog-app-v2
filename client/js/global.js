let isLoggedIn = false;
let screenWidth = window.innerWidth;
let currentUser;
let allData = [];
let ownData = [];

const postForm = document.querySelector('.post-form');
const loginForm = document.querySelector('.login');
const registerForm = document.querySelector('.register');
// const postsElement = document.querySelector('.posts');
const column1= document.querySelector('.col1');
const column2 = document.querySelector('.col2');
const column3 = document.querySelector('.col3');
const header = document.querySelector('header');
const wrapper = document.querySelector('.wrapper');
const center = document.querySelector('.center');
const center2 = document.querySelector('.center2');
const popup = document.querySelector('.popup');
const send = document.querySelector('.send-btn');
const login = document.querySelector('.login-li');
const register = document.querySelector('.register-li');
const logout = document.querySelector('.logout-li');
const mobileNav = document.querySelector('.mobile-nav');
const mobileUl = document.querySelector('.mobile-ul');
const mobileLi = document.querySelectorAll('.mobile-li');
const mobileA = document.querySelector('.mobile-link');
const burgerMenu = document.querySelector('.burger-menu');
const bar1 = document.querySelector('.bar1');
const bar2 = document.querySelector('.bar2');
const bar3 = document.querySelector('.bar3');
const searchInput = document.querySelector('.search-input');


const API_GET_ALL = '/api';
const API_GET_OWN = '/api/own';
const API_SEND = '/api/send';
const API_DELETE_ALL = '/api/delete';
const API_DELETE_ID = '/api/delete/';
const API_LOGIN = '/api/login';
const API_REGISTER = '/api/register';
const API_CHECK_SESSION = '/api/checksession';

function editor() {
  document.querySelector('#title').classList.remove('hidden');
  document.querySelector('#content').classList.remove('hidden');
  postForm.classList.remove('hidden');
  postForm.style.height = '200px';
  postForm.style.marginTop = '20px';
  send.innerHTML = 'Send';
  send.style.marginTop = '180px'
};

function createPosts(data){
  data.forEach(post => {
    //create a new div for every post
    const div = document.createElement('div');
    div.className = 'post';

    //add the title
    const title = document.createElement('h2');
    title.textContent = post.title;
    title.className = 'post-title';

    //add the content
    const content = document.createElement('p');
    content.className = 'post-content';
    content.textContent = post.content;

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
    // div.appendChild(date);

    //add delete button only when the user is also the author
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

    if(screenWidth > 1100){
      if(post.id % 2 == 0){
        column2.appendChild(div);
      }
      else if(post.id % 3 == 0){
        column3.appendChild(div);
      }
      else{
        column1.appendChild(div);
      };
    }
    else if(screenWidth >= 800){
      column1.style.width = '49%';
      column2.style.width = '49%';
      column3.style.width = '0%';

      column2.style.left = '50%';

      if(post.id % 2 == 0){
        column2.appendChild(div);
      }
      else{
        column1.appendChild(div);
      };
    }
    else if(screenWidth < 800){
      column1.style.width = '100%';
      column2.style.width = '0%';
      column3.style.width = '0%';
      column1.appendChild(div);
    };
  });
  adaptContentLength();
};

function adaptContentLength(){
  const posts = document.querySelectorAll('.post');
  console.log(posts);
  for(let el of posts){
    if(el.style.height < 420){
      el.innerHTML.substring(0,200);
    }
    else if(el.style.height <= 550){
      el.innerHTML.substring(0,300);
    }
  }
}