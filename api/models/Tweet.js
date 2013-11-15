/**
 * Tweet
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  schema: true,
  
  attributes: {
  	
    content: {
      type: "text",
      required: true,
      notNull: true,
    },
    
    mention_ids: {
      type: "array"
    },
    
    hash_tag_ids: {
      type: "array"
    },
    
    user_id: {
      type: "integer",
      required: true,
    },
  },
  
  beforeCreate: function(values, next) {
    
    values.mention_ids = [];
    values.hash_tag_ids = [];
    
    var content_hash_tags = values.content.match(HashTag.regular_expression);
    if (content_hash_tags == null) {
      content_hash_tags = [];
    }
    content_hash_tags.forEach(function(tag) {
      HashTag.findOneByName(tag.substr(1)).done(function(err, model) {
        if (model == undefined) {
          HashTag.create({
            name: tag.substr(1),
            count: 1
          }).done(function(err, user) {
            model = user;
          });
        }
        else {
         model.count = model.count + 1;
         model.save(function(err) {
           HashTag.publishUpdate(model.id, model.toJSON());
         });
        }
      
        if (values.hash_tag_ids.indexOf(model.id) == -1) {
          values.hash_tag_ids.push(model.id);
        }
      });
    });
    
    var content_mentions = values.content.match(User.regular_expression);
    if (content_mentions == null) {
      content_mentions = [];
    }
    content_mentions.forEach(function(user) {
      User.findOneByUsername(user.substring(1)).done(function(model) {
        if (model != undefined) {
          if (values.mention_ids.indexOf(model.id) == -1) {
            values.mention_ids.push(model.id);
          }
        }
      });
    });
    
    var user_id = values.user_id;
    User.findOneById(user_id).done(function(err,user) { 
      User.update_safe(user, {
        tweet_count: user.tweet_count + 1
      }, 
      function(err, models) {
        user = models[0];
        User.publishUpdate( user_id, user.toJSON());
      });
    });
    next();
  }
};
