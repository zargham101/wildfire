const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/user/index");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/user/google/callback",
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const mode = req.session?.googleMode || "login";
         
          const email = profile.emails[0].value;
  
          const existingUser = await User.findOne({ email });
  
          if (mode === "signup") {
            if (existingUser) {
              return done(null, false, { message: "User already exists. Please login." });
            }
  
            const newUser = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: email,
              image: profile.photos[0]?.value,
              password: `${profile.id}_oauth`,
            });
  
            return done(null, newUser);
          } else if (mode === "login") {
            if (!existingUser) {
              return done(null, false, { message: "No account found. Please sign up first." });
            }
  
            return done(null, existingUser);
          } else {
            if (!existingUser) {
              return done(null, false, { message: "No account found. Please sign up first." });
            }
            return done(null, existingUser);
          }
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
