var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      User.findByUsername(username).done(function(err, user) {
        if (err) { return done(err); }
        if (!user) { 
          return done(null, false, { message: 'Unknown user ' + username }); 
        }
        try {
          if (!user[0].validatePassword(password)) { return done(null, false, { message: 'Invalid password' }); }
        }
        catch(e) {}
        return done(null, false);
      })
    });
  }
));

module.exports = {
  express: {
  	customMiddleware: function(app)
  	{
  		app.use(passport.initialize());
  		app.use(passport.session());
  	}
  }
}