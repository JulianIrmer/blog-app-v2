window.onload = () => {
  loadAllPosts();
  checkSession();
};

// load all data data and create html elements
function loadAllPosts() {
  column1.innerHTML = '';
  column2.innerHTML = '';
  column3.innerHTML = '';

  fetch(API_GET_ALL)
    .then((response) => {
      return response.json();
    })
    .then((allPosts) => {
      data = allPosts;
      data.reverse();

      createPosts(data);
    })
    .catch(err => console.log(err));
};
