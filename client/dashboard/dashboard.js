
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
      console.log(ownPosts);
      data = ownPosts;
      data.reverse();
      createPosts(data);
    })
    .catch(err => console.log(err));
};

