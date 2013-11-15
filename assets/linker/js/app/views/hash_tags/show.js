TwitterApp.module('Views.HashTags', function(Views, App, Backbone, Marionette, $, _) {
  
  Views.Show = Marionette.ItemView.extend({
    template: 'assets/linker/templates/hash_tags/show.jst.eco',
    tagName: "li",
  });
});

