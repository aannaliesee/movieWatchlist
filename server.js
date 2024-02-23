const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');

const session = require('express-session');
const passport = require('passport');
require('./db/passport-config'); // Path to your passport configuration file

const port = process.env.PORT || 8080;
const app = express();

//passport configuration

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Authentication route
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to home or dashboard
        res.redirect('/');
    }
);

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
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

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});