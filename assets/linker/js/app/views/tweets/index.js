TwitterApp.module('Views.Tweets', function(Views, App, Backbone, Marionette, $, _) {
  

  
   Views.CollectionView = Marionette.CompositeView.extend({
     template: 'assets/linker/templates/tweets/index.jst.eco',
     itemView: Views.ShowLayout,
     
     appendHtml: function(collectionView, itemView, index){
         collectionView.$(".panel-body").prepend(itemView.el);
       }
   });
});

