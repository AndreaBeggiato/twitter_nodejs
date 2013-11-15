TwitterApp.module('Views.Users', function(Views, App, Backbone, Marionette, $, _) {
  
  var current_user;
  
  Views.Show = Marionette.ItemView.extend({
    template: 'assets/linker/templates/users/show.jst.eco',
    
    events : {
      'click #follow-user' : 'follow_user',
      'click #unfollow-user': 'unfollow_user'
    },
        
    ui: {
      follow_user: "#follow-user",
      unfollow_user: "#unfollow-user"
    },
    
    initialize: function() {
      var old_this = this;
      this.model.on('change', this.render, this);
      
      this.collection.me(function(user) {
        current_user = user;
        old_this.render();
      });
    },
    
    templateHelpers: {
      isFollowing: function() {
        if (current_user) {
          return current_user.get('following_ids').indexOf(this.id) != -1
        }
        else {
          return false;
        }
      },
      
      isMe: function() {
        if (current_user) {
          return current_user.id == this.id
        }
        else {
          return false;
        }
      },
      
      view_name: function() {
        if(this.display_name) {
          return this.display_name;
        }
        else {
          return this.username;
        }
      },
    
      small_image_url: function() {
        return "/images/small_missing_avatar.png";
      },
      thumb_image_url: function() {
        return "/images/thumb_missing_avatar.png";
      }
    },
    
    
    
    follow_user: function() {
      var old_this = this;
      this.collection.me(function(current_user) {
        current_user.add_following(old_this.model, function() {
        });
      });
      return false;
    },
    
    unfollow_user: function() {
      var old_this = this;
      this.collection.me(function(current_user) {
        current_user.remove_following(old_this.model, function() {
        })
      });
      return false;
    }
    
  });
});