// ########## DEPENDENCIES ########## 
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongojs = require('mongojs');
const bcrypt = require('bcrypt');
const http = require('http').Server(app);
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


// ########## GLOBAL VARIABLES ##########
const port = 5000;
const DB_URL = 'mongodb://admin:lala1234@ds147566.mlab.com:47566/blog-app';
let seqID = 0;
const salt = bcrypt.genSaltSync(10);


// ########## DATABASE CONNECTION ##########
db = mongojs(DB_URL, ['Posts', 'User']);
db.on('error', (err) => {
  console.log('database error', err)
});

db.on('connect', () => {
  console.log('database connected')
});


// ########## MIDDLEWARE ##########
const sessConfig = {
  name: 'sid',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: DB_URL,
    ttl: 60*60, //(sec*min*hour*day)
    autoRemove: 'native'
  })
};

app.use(session(sessConfig));
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: '*'}));
app.use(express.static(__dirname + '/client'));
// app.use(express.static(__dirname + '/client/messenger'));

// check if the user is already logged in
let authenticate = (req, res, next) => {
  // console.log(req.session.username);
  if(!req.session.username){
    res.redirect('/login');
  }
  else{
    next();
  };
};


// ######### VIEW ROUTES #########
// landing
app.get('/', (req, res) => {
  res.sendFile(__dirname+ '/client/html/index.html');
});


// login
app.get('/login', (req, res) => {
  res.sendFile(__dirname+ '/client/login/login.html');
});


// messenger desktop (width > 900)
app.get('/home', authenticate, (req, res) => {
  res.sendFile(__dirname+ '/client/html/index.html');
});


//get latest ID
function getMaxID(){
  db.Posts.find().sort({id: -1}, (err, docs) => {
    if(docs.length > 0){
      maxID = docs[0].id;
      seqID = maxID;
    }
    else{
      console.log('no data');
    };
  });
};


//check if the user has a session
app.get('/api/checksession', (req, res) => {
  console.log('Checking Session... '+req.session.username);

  if(req.session.username){
    res.json({
      isLoggedIn:true,
      username:req.session.username
    });
  }
  else{
    res.json({'isLoggedIn':false});
  };
});


// ########## REGISTRATION ROUTE ##########
app.post('/api/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // Check if name is available
  db.User.findOne({name:name}, (err, result) => {
    if(err){
      console.error(err);
    }
    else if(result != null){
      console.error('name not valid');
      res.json({name: false});
    }
    else{
      // Check if email is available
      db.User.findOne({email:email}, (err, result2) => {
        if(err){
          console.error(err);
        }
        else if(result2){
          console.error('email not valid');
          res.json({email: false});
        }
        else{
          // if both NAME and EMAIL are available a new user will be added to the db

          // hash the user pw
          const hash = bcrypt.hashSync(password, salt);
          // hash the id based on the name
          const id = bcrypt.hashSync(name, salt);

          // fill the user object
          const user = {
            id: id,
            name : name,
            email : email,
            password : hash
          };

          // add the user
          db.User.save(user, (err) => {
            if(err){
              console.error(err);
            }
            else{
              console.log('user registered');
              res.json({'message':'success'});
            };
          });
        };
      });
    };
  });
});


// ########## LOGIN ROUTE ##########
app.post('/api/login', (req, res) => {
  const username = req.body.name;
  const password = req.body.password;

  // checking for username
  db.User.findOne(
    {name: username},
    (err, user) => {
    if (err) {
      console.error(err);
    } else if (user == null) {
      console.log(user);
      res.json({'message': 'no user'});
    } else {
        console.log('Found: ' +user.name);
        bcrypt.compare(password, user.password).then((response) => {
          if (response == false) {
            console.log('password wrong!');
            res.json({'login': false});
          } else {
            activeUser = username;
            console.log(`${activeUser} logged in.`);
            req.session.username = username;
            req.session.userID = user.id;
            // console.log(req.session.username);
            res.json({'login':true});
          };
        })
        .catch((err) => console.error(err));
    };
  });
});


// ########## LOGOUT ROUTE ##########
app.get('/api/logout', authenticate, (req, res) => {
  req.session.destroy();
});

// ########## GET ALL POSTS ##########
app.get('/api', (req, res) => {
  db.Posts.find((err, posts) => {
    if(err){
      console.log('database error', err);
    }
    else{
      if(posts == null){
        res.send('No data');
      }
      else{
        res.json(posts);
      };
    };
  });
  getMaxID();
});

// ########## SAVE A POST ##########
app.post('/api/send', (req, res) => {
  let data = req.body;

  seqID++;
  data.id = seqID;
  data.uid = bcrypt.hashSync('seqID', salt);
  data.comments = [];

  db.Posts.save(data);
});

// ########## ADD A COMMENT ##########
app.post('/api/send', (req, res) => {
  let data = req.body;
  data.uid = bcrypt.hashSync(id, salt);
});


// ########## DELETE SINGLE POST ##########
app.post('/api/delete/:id', (req, res) => {
  let postid = JSON.parse(req.params.id);

  db.Posts.remove({id: postid}, (err) => {
    if(err){
      console.log('database error', err);
    }
    else{
      console.log(`Deleted post with id ${postid}`);
    };
  });
});


// ########## START EXPRESS SERVER ##########
http.listen(port, (err) => {
  if(err){
    console.error(err);
  }
  else{
    console.log(`Server listening on localhost:${port}`);
  };
});

