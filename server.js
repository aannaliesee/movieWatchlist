const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const dotenv = require('dotenv');

const session = require('express-session');
const passport = require('passport');
require('./db/passport-config'); // Path to your passport configuration file

const port = process.env.PORT || 8080;
const app = express();

dotenv.config(); // Load environment variables from .env file
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);

//passport configuration

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Authentication for Google
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      //debugging 
        console.log('Google callback reached successfully');
        // Successful authentication, redirect to home or dashboard
        res.redirect('/profile');
    }
);

// Routes for GitHub authentication
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


// Protected route example (profile or landing page)
app.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile', { user: req.user });
});


// Ensure authentication middleware
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // Redirect to login if not authenticated
}

// Protected route example
app.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

//
app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));

  //catchall for errors that show what errors are thrown
  process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
  });

  //debugging
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});