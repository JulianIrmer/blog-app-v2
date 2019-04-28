
let cleanResults = [];
let searchResults = [];


window.onload = () => {
  checkSession();
  loadAllPosts();

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

  // close mobile nav if link is clicked
  for(let el of mobileLi){
    el.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
      bar1.classList.remove('left-to-right');
      bar2.classList.remove('no-opacity');
      bar3.classList.remove('right-to-left');
      burgerMenu.classList.remove('no-border');
    });
  };
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
        login.innerHTML = 'Dashboard';
        register.classList.add('hidden');
        isLoggedIn = true;
      } else {
        logout.classList.add('hidden');
        postForm.classList.add('hidden');
      };
    })
    .catch(err => console.log(err));
};

//create a post
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

  console.log('hello');
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
  column1.innerHTML = '';
  column2.innerHTML = '';
  column3.innerHTML = '';

  fetch(API_GET_ALL)
    .then((response) => {
      return response.json();
    })
    .then((allPosts) => {
      allData = allPosts;
      allData.reverse();
      createPosts(allData);
    })
    .catch(err => console.log(err));
};

// login button
login.addEventListener('click', () => {
  if (login.textContent == 'Login') {
    window.location.replace('/login');
  }
  else{
    window.location.replace('/dashboard');
  }
});

// register button
register.addEventListener('click', () => {
  window.location.replace('/login');
});

// logout button
logout.addEventListener('click', () => {
  fetch('/api/logout');
  window.location.replace('/');
});

// filter posts
searchInput.addEventListener('input', (e) => {
  column1.innerHTML = '';
  column2.innerHTML = '';
  column3.innerHTML = '';


  e.preventDefault();
  input = searchInput.value;
  searchResults = [];
  cleanResults = [];

  for(let el of allData){

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

//Delete double entries and return clean array
function cleanData(){
  cleanResults = searchResults.filter(function(item, pos, self) {
    return self.indexOf(item) == pos;
  });
};

function editor() {
  document.querySelector('#title').classList.remove('hidden');
  document.querySelector('#content').classList.remove('hidden');
  postForm.classList.remove('hidden');
  postForm.style.height = 200 + 'px';
  send.innerHTML = 'Send';
  send.style.marginTop = '180px'
};