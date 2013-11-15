TwitterApp.module('Collections', function(Collections, App, Backbone, Marionette, $, _) {
  
  Collections.HashTags = Backbone.Collection.extend({
    model: TwitterApp.Models.HashTag,
    url: '/hashtag',
    
    comparator: function(a,b) {
      if ( a.get("count") > b.get("count") ) return -1;
      if ( a.get("count") < b.get("count") ) return 1;
      if ( a.get("count") === b.get("count") ) return 0;
    },
    
    initialize: function() {
      var self = this;
      this.bindSocket();
      this.on('change:count', function() { self.sort() });
    },
    
    search: function(data, success_callback) {
      this.fetch(
        { 
          data: {
            where: data
          },
          success: success_callback
      });
    },
    
    top: function(cb) {
      this.fetch(
        {
          data: {
            sort: 'count desc',
            limit: 5
          },
          success: cb
        }
      );
    }
  });
});