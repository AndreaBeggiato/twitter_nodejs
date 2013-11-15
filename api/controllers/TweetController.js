/**
 * TweetController
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
   * (specific to TweetController)
   */
  _config: {
  },
  
  create: function (req, res) {
    var tweet_param = req.param('tweet');
    console.log('user id' + req.session.passport.user);
    Tweet.create({
      content: req.param('content'),
      user_id: req.session.passport.user
    }).done(function(err, model) {
      if (err) {
        return res.send(err,500);
      }
      else {
        if (req.isSocket) Tweet.publishCreate(model.toJSON());
        res.json(model);
      }
    });
    
  }

  
};
