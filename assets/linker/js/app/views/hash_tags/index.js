TwitterApp.module('Views.HashTags', function(Views, App, Backbone, Marionette, $, _) {
  

   Views.CollectionView = Marionette.CompositeView.extend({
     template: 'assets/linker/templates/hash_tags/index.jst.eco',
     itemView: Views.Show,
     itemViewContainer: '#top-hash-tag',
     
     initialize: function() {
       var self = this;
       this.collection.on('all', function() {
         self.render();
       });
     }
     
   });
});