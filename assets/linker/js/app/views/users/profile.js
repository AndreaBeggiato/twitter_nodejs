TwitterApp.module('Views.Users', function(Views, App, Backbone, Marionette, $, _) {
  
  Views.ProfileView = Marionette.ItemView.extend({
    template: 'assets/linker/templates/users/profile.jst.eco',
    
    initialize: function() {
      this.model.on('change', this.render, this);
    },
    
    templateHelpers: {
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
    }
  });
});