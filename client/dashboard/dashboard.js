
window.onload = () => {
  checkSession();
  loadOwnPosts();

  if(window.innerWidth <= 600){
    burgerMenu.classList.remove('hidden');
  };
  if(window.innerWidth > 600){
    burgerMenu.classList.add('hidden');
  };


  // open and close the mobile nav on click event
  burgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
    bar1.classList.toggle('left-to-right');
    bar2.classList.toggle('no-opacity');
    bar3.classList.toggle('right-to-left');
  });

  if (isLoggedIn) {
    login.innerHTML = 'Dashboard';
    register.classList.add('hidden');
    isLoggedIn = true;
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

