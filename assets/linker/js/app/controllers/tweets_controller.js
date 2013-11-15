TwitterApp.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
  
   var tweets = new App.Collections.Tweets();
   
   var new_tweet_fetched = false;
   var success_function = function(region) {
     var view = new App.Views.Tweets.CollectionView({
       collection: tweets
     });
     region.show(view);
  };
  var TweetsController = {
    index: function(hash_tag) {
      if (!hash_tag) {
        tweets.hash_tag_id = false;
        tweets.user_id = false;
        tweets.fetch({
          data: {
            sort: 'createdAt desc'
          },
          success: success_function(App.Views.Layouts.Application.content),
          reset: true
        });
      }
      else{
        var hashtags = new App.Collections.HashTags();
        hashtags.search({name: hash_tag}, function(data) {
          tweets.hash_tag_id = data.models[0].get('id');
          tweets.user_id = false;
          tweets.fetch({
            data: {
              where: {
                hash_tag_ids: {
                  contains: data.models[0].get('id')
                } 
              },
              sort: 'createdAt desc'
            },
            success: success_function(App.Views.Layouts.Application.content),
            reset: true
          });
        });
      }
    },
    
    new: function() {
      if (!new_tweet_fetched) {
        new_tweet_fetched = true;
        var view = new TwitterApp.Views.Tweets.NewView({
          model: new TwitterApp.Models.Tweet()
        });
        App.Views.Layouts.CurrentUser.new_tweet.show(view);
      }
    },
    
    user_tweets: function(id) {
      tweets.hash_tag_id = false;
      tweets.user_id = id;
      tweets.fetch({
        data: {
          where: {
            user_id: id
          },
          sort: 'createdAt desc'
        },
        success: success_function(App.Views.Layouts.ShowUser.tweets),
        reset: true
      });
    }
  };
  
   App.on('routes:root', TweetsController.index);
   App.on('routes:always', TweetsController.new);
   
   App.on("routes:hashtags/:name/tweets", TweetsController.index);
   

   App.on('routes:users/:id/tweets', TweetsController.user_tweets)
});