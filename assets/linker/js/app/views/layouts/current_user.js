TwitterApp.module('Views.Layouts', function(Views, App, Backbone, Marionette, $, _) {
   var currentUser = Backbone.Marionette.Layout.extend({
    template: 'assets/linker/templates/layouts/current_user.jst.eco',

    regions: {
      new_tweet: "#new_tweet",
      profile: '#profile'
    }
  });
  Views.CurrentUser = new currentUser();
});