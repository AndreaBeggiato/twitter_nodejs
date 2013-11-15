TwitterApp.module('Views.Layouts', function(Views, App, Backbone, Marionette, $, _) {
   var showUser = Backbone.Marionette.Layout.extend({
    template: 'assets/linker/templates/layouts/show_user.jst.eco',

    regions: {
      user: "#user",
      tweets: '#tweets'
    }
  });
  Views.ShowUser = new showUser();
});