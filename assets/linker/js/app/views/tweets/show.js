TwitterApp.module('Views.Tweets', function(Views, App, Backbone, Marionette, $, _) {
  var userCollection = new TwitterApp.Collections.Users();
  
  
  
  Views.ShowLayout = Marionette.Layout.extend({
    template: 'assets/linker/templates/tweets/show.jst.eco',

    regions: {
      user: ".user"
    },
    
    templateHelpers: {
        formatted_content: function(){
          var result = this.content;
          var hash_tags_regex = /\B#\w+/g;
          var hash_tags = this.content.match(hash_tags_regex);
          
          if (!hash_tags) {
            hash_tags = []
          }
          
          $.each(hash_tags, function(i, v) {
            var tag = v.substr(1);
            result = result.replace(v, '<a href="#hashtags/' + tag + '/tweets">' + v + '</a>');
          })
          return result;
        }
      },
    
      //da riguardare per lo user
    initialize: function () {
      var me = this;
      this.model.on('change', this.render, this);
        userCollection.search({ id: this.model.get('user_id') }, function(data) {
          user = data.models[0];

          var view = new App.Views.Users.MiniProfile({
            model: user
          });
          me.user.show(view);
        });
    }
  });
});
