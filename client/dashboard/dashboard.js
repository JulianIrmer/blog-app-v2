
window.onload = () => {
  loadOwnPosts();
  checkSession();

  if(window.innerWidth <= 600){
    burgerMenu.classList.remove('hidden');
  };
  if(window.innerWidth > 600){
    burgerMenu.classList.add('hidden');
  };
  if(window.innerWidth < 800){
    fullStory.style.height = window.innerHeight-100;
  }

  if(isLoggedIn) {
    login.innerHTML = 'Dashboard';
    mobileLogout.textContent = 'Logout'
    register.classList.add('hidden');
  };
};

// load all data data from the logged in user and create html elements
function loadOwnPosts() {
  column1.innerHTML = '';
  column2.innerHTML = '';
  column3.innerHTML = '';

  fetch(API_GET_OWN)
    .then((response) => {
      return response.json();
    })
    .then((ownPosts) => {
      data = ownPosts;
      data.reverse();
      createPosts(data);
    })
    .catch(err => console.log(err));
};

// create a story
send.addEventListener('click', (event) => {
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
  setTimeout(() => {
    loadOwnPosts();
  }, 500);
  document.querySelector('#title').value = '';
  document.querySelector('#content').value = '';
});
