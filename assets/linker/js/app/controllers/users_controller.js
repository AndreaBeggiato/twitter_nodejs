TwitterApp.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
  
  var users = new App.Collections.Users();
  
  var current_user;
  
  var UsersController = {
    profile: function() {
      if (!current_user) {
        users.me(function(user) {
          current_user = user;
          var view = new App.Views.Users.ProfileView({
            model: current_user
          });
          App.Views.Layouts.CurrentUser.profile.show(view);
        });
      }
    },
    
    show: function(id) {
      users.search({id: id}, function(collection) {
        var view = new App.Views.Users.Show({
          model: collection.models[0],
          collection: collection
        });
        App.Views.Layouts.ShowUser.user.show(view);
      })
    },
    
    edit_me: function() {
      users.me(function(user) {
        var view = new App.Views.Users.Edit({
          model: user
        });
        App.Views.Layouts.Application.content.show(view);
      })
    }
  };
  
  App.on('routes:always', UsersController.profile);
  App.on('routes:users/:id/tweets', UsersController.show)
  App.on("routes:users/edit/me", UsersController.edit_me);
});