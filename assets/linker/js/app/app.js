TwitterApp.on('initialize:after', function() {
  Backbone.history.start();
});

TwitterApp.start();
