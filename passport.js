const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// Configure Passport.js Local Strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    // Fetch user from DB (example uses a mock user)
    const user = { id: 1, username: "test", passwordHash: "$2b$10$..." }; // passwordHash is bcrypt hashed password

    if (!user || user.username !== username) {
      return done(null, false, { message: "Incorrect username." });
    }

    // Verify password using bcrypt
    bcrypt.compare(password, user.passwordHash, (err, result) => {
      if (err) return done(err);
      if (result) return done(null, user); // Passwords match
      return done(null, false, { message: "Incorrect password." });
    });
  })
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  // Find user by ID (in practice, you would fetch the user from the database)
  const user = { id: 1, username: "test" };
  done(null, user);
});


