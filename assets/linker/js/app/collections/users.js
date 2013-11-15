TwitterApp.module('Collections', function(Collections, App, Backbone, Marionette, $, _) {
  
  Collections.Users = Backbone.Collection.extend({
    model: TwitterApp.Models.User,
    url: function() {
      if (this.searching) {
        return 'user/findAll'
      }
      else {
        return '/user'
      }
    },
    
    initialize: function() {
      this.bindSocket();
    },
    
    search: function(data, success_callback) {
      this.fetch(
        { 
          data: {
            where: data
          },
          success: success_callback
      });
    },
    
    me: function(success_callback) {
      if (!this.current_user) {
        var old_this = this;
        socket.get('/user/me', function(response) {
          old_this.current_user = new App.Models.User(response);
          old_this.add(old_this.current_user);
          success_callback(old_this.current_user);
        });
      }
      else {
        success_callback(this.current_user);
      }
    }
  });
});