TwitterApp.module('LayoutManager', function(LayoutManager, App, Backbone, Marionette, $, _) {
  
  var application_layout = App.Views.Layouts.Application;
  var current_user_layout = App.Views.Layouts.CurrentUser;
  var show_user_layout = App.Views.Layouts.ShowUser
  
  App.container.show(application_layout);

  application_layout.current_user.show(current_user_layout);
  
  App.on('routes:users/:id/tweets', function() {
    application_layout.content.show(show_user_layout);
  });
  
});