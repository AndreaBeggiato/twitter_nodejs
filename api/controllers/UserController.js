/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
passport = require('passport')
module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},
  
  create: function (req, res) {
    var user_param = req.param('user');
    User.create(user_param).done(function(error, model) {
      if (error) {
        //error.ValidationError
        return res.view('session/new', {error: 'error'});
      }
      else {
        req.login(model, function(err) {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      }
    });  
  },
  
  update: function(req, res) {
   var user_id = req.param('id');
   var data = {
     display_name: req.param('display_name'),
     bio: req.param('bio')
   }
   User.findOneById(user_id).done(function(err, user) {
     User.update_safe(user, data, function(err, models) {
       user = models[0];
       User.publishUpdate( user.id, user.toJSON());
     });
   });
  },
  
  me: function(req, res) {
    User.findOneById(req.session.passport.user).done(function(err,user) {
      res.json(user);
    });
  }
};
