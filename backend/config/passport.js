const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/user/index");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/user/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
    
          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
    
            if (user) {
              user.googleId = profile.id;
              user.image = user.image || profile.photos[0]?.value;
              await user.save();
            } else {
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0]?.value,
                password: `${profile.id}_oauth`, 
              });
            }
          }
    
          return done(null, user);
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
