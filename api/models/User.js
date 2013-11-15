/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var bcrypt = require('bcrypt-nodejs');

module.exports = {

  regular_expression: /\B@\w+/g,
  schema: true,
  attributes: {
  	
  	username: {
      type: "STRING",
      required: true
    },
    display_name: "STRING",
    bio: "STRING",
    tweet_count: {
      type: "INTEGER"
    },
    follower_count: {
      type: "INTEGER"
    },
    following_count: {
      type: "INTEGER"
    },
    following_ids: {
      type: "ARRAY"
    },
    follower_ids: {
      type: "ARRAY"
    },
    email: "EMAIL",
    salt: 'STRING',
    encrypted_password: 'STRING',
    
    validatePassword: function(password) {
      return bcrypt.compareSync(password, this.encrypted_password);
    },
    
    
  },
  
  update_safe: function(model, data, callback) {
    if (data.following_ids == undefined) {
      data.following_ids = model.following_ids;
    }
    if (data.follower_ids == undefined) {
      data.follower_ids = model.follower_ids;
    }
    User.update(model.id, data, callback)
  },
  
  beforeCreate: function(values, next) {
    values.salt = bcrypt.genSaltSync();
    values.encrypted_password = bcrypt.hashSync(values.encrypted_password, values.salt);
    values.follower_count = values.tweet_count = values.following_count = 0;
    values.following_ids = values.follower_ids = [];
    if (values.display_name == undefined) {
      values.display_name = "";
    }
    values.bio = "";
    next();
  },
  
  beforeUpdate: function(values, next) {
    values.follower_count = values.follower_ids.length;
    values.following_count = values.following_ids.length;
    next();
  }
  
  
};
