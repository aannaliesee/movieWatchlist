// passport-config.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
}, (accessToken, refreshToken, profile, done) => {
    // Create a user object with profile information
    const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value, // Assuming the first email is the primary one
        // Add other relevant fields from the profile
    };

    // Pass the user object to the done callback
    done(null, user);
}));


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    // Your GitHub authentication logic here
}));

// Serialize user object to store in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
    // Retrieve user from the database based on id
    // Call done() with the user object
});
