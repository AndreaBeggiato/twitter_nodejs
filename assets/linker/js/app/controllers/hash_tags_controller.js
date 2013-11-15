TwitterApp.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
  
  var top_hash_tag_collection = new App.Collections.HashTags(); 
  var top_hash_tag_fetched = false;
  
  var HashTagsController = {
    top: function() {
      if (!top_hash_tag_fetched) {
        top_hash_tag_fetched = true;
        top_hash_tag_collection.top(function() {
          var view = new App.Views.HashTags.CollectionView({
            collection: top_hash_tag_collection
          });
          App.Views.Layouts.Application.hash_tags.show(view);
        });
      }
    }  
  }
  
  App.on('routes:always', HashTagsController.top);
});