/**
 * FollowingController
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

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to FollowingController)
   */
  _config: {},
  
  create: function(req, res) {
    var current_user_id = req.session.passport.user;
    var following_id = req.param('user_id');
    
    if (following_id != current_user_id) {
      User.findOneById(current_user_id).done(function(err, current_user) {
        if (current_user.following_ids.indexOf(following_id) == -1) {
          var new_following = current_user.following_ids.concat(following_id);
          console.log(new_following);
          console.log('----');
          console.log(current_user.following_ids);
          User.update_safe(current_user, {
            following_ids: new_following
          }, 
          function(err, models) {
            user = models[0];
            User.publishUpdate( current_user.id, user.toJSON());
          });
        }
      });
    
      User.findOneById(following_id).done(function(err, following_user) {
        if (following_user.follower_ids.indexOf(current_user_id) == -1) {
          var new_follower = following_user.follower_ids.concat(current_user_id);
          User.update_safe(following_user, {
            follower_ids: new_follower
          }, 
          function(err, models) {
            user = models[0];
            User.publishUpdate( following_user.id, user.toJSON());
          });
        }
      });
    }
    
    res.send(201);
    
  },
  
  delete: function(req, res) {
    var current_user_id = req.session.passport.user;
    var following_id = req.param('id');
    
    if (following_id != current_user_id) {
      User.findOneById(current_user_id).done(function(err, current_user) {
        var new_following = current_user.following_ids.filter(function(i) { i != following_id});
        User.update_safe(current_user, {
          following_ids: new_following
        }, 
        function(err, models) {
          user = models[0];
          User.publishUpdate( current_user.id, user.toJSON());
        });
      });
    
      User.findOneById(following_id).done(function(err, following_user) {
        var new_follower = following_user.follower_ids.filter(function(i) { i != current_user_id});
        User.update_safe(following_user, {
          follower_ids: new_follower
        }, 
        function(err, models) {
          user = models[0];
          User.publishUpdate( following_user.id, user.toJSON());
        });
      });
    }
    
    res.send(201);
  }

  
};
