TwitterApp.module('Models', function(Models, App, Backbone, Marionette, $, _) {
  Models.User = Backbone.Model.extend({
    url: '/user',
    webSocket: true,
    modelName: "user",
    
    initialize: function() {
      this.bindSocket();
    },
    
    add_following: function(user,cb) {
      
      socket.post('/following', { user_id: user.id } ,function(response) {
        cb();
      });
    },
    
    remove_following: function(user, cb) {
      socket.delete('/following/' + user.id, function(response) {
        cb();
      });
    }
  });
});