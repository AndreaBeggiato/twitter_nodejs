TwitterApp.module('Views.Layouts', function(Views, App, Backbone, Marionette, $, _) {
   var applicationLayout = Backbone.Marionette.Layout.extend({
    template: 'assets/linker/templates/layouts/application.jst.eco',

    regions: {
      current_user: "#current_user",
      hash_tags: "#hash_tags",
      content: "#content"
    }
  });
  Views.Application = new applicationLayout();
});