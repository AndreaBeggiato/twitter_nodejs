TwitterApp.module('Models', function(Models, App, Backbone, Marionette, $, _) {
  Models.HashTag = Backbone.Model.extend({
    url: '/hashtag',
    webSocket: true,
    modelName: "hashtag",
    
    initialize: function() {
      this.bindSocket();
    },
  });
});