TwitterApp.module('Collections', function(Collections, App, Backbone, Marionette, $, _) {
  
  Collections.Tweets = Backbone.Collection.extend({
    model: TwitterApp.Models.Tweet,
    url: '/tweet',
    
    initialize: function() {
        this.bindSocket();
      },
    
    matchSocket: function(model) {
      if (this.hash_tag_id) {
        if (model.hash_tag_ids.indexOf(this.hash_tag_id) != -1) {
          return true;
        }
        else {
          return false;
        }
      }
      
      if (this.user_id) {
        if (model.user_id == this.user_id) {
          return true;
        }
        else {
          return false;
        }
      }  
      return true;
    }
  });
});