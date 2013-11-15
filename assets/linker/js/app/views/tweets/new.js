TwitterApp.module('Views.Tweets', function(Views, App, Backbone, Marionette, $, _) {
  
  Views.NewView = Marionette.FormView.extend({
    template: 'assets/linker/templates/tweets/new.jst.eco',
    
    fields: {
      content: {
        el: ".content",
        required: "Please enter the content"
      }
    },
    
    ui: {
      tweet_input: 'textarea[data-field="content"]'
    },
    
    onSubmit: function(evt) {
      evt.preventDefault();
      var data = this.serializeFormData();
      (new TwitterApp.Models.Tweet(data)).save();
      $(this.ui.tweet_input).val('');
      //TODO: Mah?!? facciamo cosi' oppure:
      //  1. cerchiamo un modo di farlo nel controller e poi come 2.
      //  2. salviamo ed aspettiamo l'evento del socket io cosi' aggiorniamo la collection nel controller 
      //  3. Chissa.
    },
    
    onSubmitFail: function(errors) {
      console.log(errors);
      _.each(_.keys(errors), function(e) { }); //TODO far vedere gli errori;
    }
  });
});