/**
 * HashTag
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  regular_expression: /\B#\w+/g,
  
  schema: true,
  attributes: {
    name: {
      type: "STRING",
      required: true
    },
    count: {
      type: "INTEGER",
      required: true
    }
    
  }

};
