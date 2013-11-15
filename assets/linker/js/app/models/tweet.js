TwitterApp.module('Models', function(Models, App, Backbone, Marionette, $, _) {
  Models.Tweet = Backbone.Model.extend({
    url: '/tweet',
    webSocket: true,
    modelName: "tweet",
    
    initialize: function() {
      this.bindSocket();
    },
  });
});