
window.onload = () => {
  loadOwnPosts();
  checkSession();

  if(isLoggedIn) {
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

