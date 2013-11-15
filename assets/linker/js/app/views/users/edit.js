TwitterApp.module('Views.Users', function(Views, App, Backbone, Marionette, $, _) {
  
  Views.Edit = Marionette.FormView.extend({
    template: 'assets/linker/templates/users/edit.jst.eco',
    
    fields: {
      display_name: {
        el: "#display_name",
      },
      bio: {
        el: "#bio"
      },
      id: {
        el: "#user_id"
      },
      follower_ids: {
        el: "#follower_ids"
      },
      following_ids: {
        el: "#following_ids"
      }
    },
    
    onSubmit: function(evt) {
      evt.preventDefault();
      var data = this.serializeFormData();
      var user = new TwitterApp.Models.User(data);
      user.save();
      Backbone.history.navigate("/", { trigger: true});
    },
    
    onSubmitFail: function(errors) {
      console.log(errors);
      _.each(_.keys(errors), function(e) { }); //TODO far vedere gli errori;
    }
    
  });
});