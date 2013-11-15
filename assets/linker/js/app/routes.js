TwitterApp.module('Router', function(AppRouter, App, Backbone, Marionette, $, _) {
  
  var RouterController = {
    root: function() {

      App.trigger("routes:always");
      App.trigger("routes:root");
    },
    
    tweets_show: function(id) {
      App.trigger("routes:always");
      App.trigger("routes:tweets/:id", id)
    },
    
    hashtags_tweets: function(name) {
      App.trigger("routes:always");
      App.trigger("routes:hashtags/:name/tweets", name);
    },
    
    user_tweets: function(id) {
      App.trigger("routes:always");
      App.trigger("routes:users/:id/tweets", id);
    },
    
    user_edit: function() {
      App.trigger("routes:always");
      App.trigger("routes:users/edit/me");
    }
  }
  
  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      "": "root",
      "tweets/:id": "tweets_show",
      "hashtags/:name/tweets": "hashtags_tweets",
      "users/:id/tweets": "user_tweets",
      "users/edit/me": "user_edit"
    }
  });
  
  AppRouter.Router = new Router({
        controller: RouterController
      });
  TwitterApp.addInitializer(function() { 
    AppRouter.Router
  });
});