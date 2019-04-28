let cleanResults = [];
let searchResults = [];

window.onload = () => {
  if(window.innerWidth <= 600){
    burgerMenu.classList.remove('hidden');
  };
  if(window.innerWidth > 600){
    burgerMenu.classList.add('hidden');
  };

  loadOwnPosts();

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
  } else {
    logout.classList.add('hidden');
    postForm.classList.add('hidden');
  };

  searchInput.addEventListener('input', (e) => {
    column1.innerHTML = '';
    column2.innerHTML = '';
    column3.innerHTML = '';


    e.preventDefault();
    input = searchInput.value;
    searchResults = [];
    cleanResults = [];
    console.log(input);
    for(let el of ownData){

      if(el.title.toLowerCase().includes(input.toLowerCase())){
        searchResults.push(el);
      }
      else if(el.content.toLowerCase().includes(input.toLowerCase())){
        searchResults.push(el);
      }
      else if(el.author.toLowerCase().includes(input.toLowerCase())){
        searchResults.push(el);
      }
      else if(el.date.toLowerCase().includes(input.toLowerCase())){
        searchResults.push(el);
      };
    };
    cleanData();
    createPosts(cleanResults);
  });
  // get own posts from db and display them
};


//Delete double entries and return clean array
function cleanData(){
  cleanResults = searchResults.filter(function(item, pos, self) {
    return self.indexOf(item) == pos;
  });
};


//create new html elements for every element in the array
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
      ownData = ownPosts;
      ownData.reverse();
      createPosts(ownData);
    })
    .catch(err => console.log(err));
};



