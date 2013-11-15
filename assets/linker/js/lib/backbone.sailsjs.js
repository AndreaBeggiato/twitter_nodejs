(function() {
  var oldBackboneSync = Backbone.sync;
  var connected = new Promise();
  
  socket.on('connect', function() { 
    connected.resolve(socket);
  });
  
  Backbone.sync = function(method, model, options) {
    var socketBinding = model.socketBinding || (model.collection && model.collection.socketBinding);
    
    options = _.clone(options) || {};
    
    var error = options.error || function() {};
    var success = options.success || function() {};
    
    if (socketBinding) {
      // Ensure that we have a URL.
      if (!options.url) {
        options.url = _.result(model, 'url')
      }
      if (!options.url) {
        throw new Error("Url must be specified.");
      }
      
      delete options.error;
      delete options.success;
      delete options.collection;
      
      socketBinding.ready(function() {
        model.trigger('request', model, options);
        switch(method) {
          case 'read':
            socketBinding.socket.get(options.url, options.data, function(response) {
              if (response.status) {
                error(response)
              }
              else {
                success(response);
              }
            });
            break;
          case 'create':
            socketBinding.socket.post(options.url, model, function(response) {
              if (response.status) {
                error(response)
              }
              else {
                success(response);
              }
            });
            break;
          case 'update':
            socketBinding.socket.put(options.url + "/" + model.id, model, function(response) {
              if (response.status) {
                error(response)
              }
              else {
                success(response);
              }
            });
            break;
          default: alert("method " + method + " unknow");
        }
      });
    }
    else {
      // Call the original Backbone.sync
      return oldBackboneSync(method, model, options);
    }
    
  };
  
  function inherits(Parent, Child, mixins) {
    var Func = function() {};
    Func.prototype = Parent.prototype;

    mixins || (mixins = [])
    _.each(mixins, function(mixin) {
      _.extend(Func.prototype, mixin);
    });

    Child.prototype = new Func();
    Child.prototype.constructor = Child;

    return _.extend(Child, Parent);
  };
  
  function addSocketBindingModel(Parent) {
    // Override the parent constructor
    var Child = function(attributes, options) {
      if (options && options.webSocket) {
        if (options.modelName) {
          this.webSocket = options.webSocket;
          this.modelName = options.modelName;
        }
        else {
          throw new Error("Need modelName to enable socket!")
        }
      }
      if (this.webSocket) {
        this.socketBinding = buildSocketBinding(this);
      }

      Parent.apply(this, arguments);
    };

    // Inherit everything else from the parent
    return inherits(Parent, Child, [MixinsModel]);
  }
  
  function addSocketBindingCollection(Parent) {
    // Override the parent constructor
    var Child = function(models, options) {
      if (this.model && this.model.prototype.webSocket) {
        if (this.model.prototype.modelName) {
          this.webSocket = this.model.prototype.webSocket;
          this.modelName = this.model.prototype.modelName;
          if (!this.matchSocket) {
            this.matchSocket = function() { return true }; 
          }
          else {
            this.matchSocket = this.matchSocket;
          }
        }
        else {
          throw new Error("Need modelName to definitions enable socket!")
        }
      }
      if (this.webSocket) {
        this.socketBinding = buildSocketBinding(this);
      }

      Parent.apply(this, arguments);
    };

    // Inherit everything else from the parent
    return inherits(Parent, Child, [MixinsCollection]);
  }
  
  function buildSocketBinding(collection) {
    var ready = new Promise();
    
    var socketBinding = {
      socket: socket,
      ready: function(callback) {
        ready.then(callback);
      }
    }
    
    connected.then(function(socket) {
      ready.resolve();
    })
    
    return socketBinding;
  }
  
  var MixinsCollection = {
    // Listen for backend notifications and update the
    // collection models accordingly.
    bindSocket: function() {
      var self = this;
      var idAttribute = this.model.prototype.idAttribute;
      
      this.socketBinding.ready(function() {
        socket.on('message', function(message) {
          if (message.model == self.modelName) {
            var model = message.data;
            switch (message.verb) {
              case "create": 
                if (self.model && self.matchSocket(model)) {
                  self.add(model);
                }
                break;
               case "update":
                 console.log("method " + message.verb + " on collection");
                break;
              case "destroy":
                if (self.model) {
                  self.remove(message[idAttribute]);
                }
                break;
              default: alert("method " + message.verb + " is unknow")
              break;
            }
          }
        });
      });
    }
  };
  
  var MixinsModel = {
    // Listen for backend notifications and update the
    // collection models accordingly.
    bindSocket: function() {
      var self = this;
      var idAttribute = this.idAttribute;
      
      this.socketBinding.ready(function() {
        socket.on('message', function(message) {
          var model = message.data;
          if (message.verb == 'update' && message.model == self.modelName && model[idAttribute] == self.id) {
            self.set(model);
          }
        });
      });
    }
  };

    Backbone.Collection = addSocketBindingCollection(Backbone.Collection);
    Backbone.Model = addSocketBindingModel(Backbone.Model);
    
    function Promise(context) {
      this.context = context || this;
      this.callbacks = [];
      this.resolved = undefined;
    };

    Promise.prototype.then = function(callback) {
      if (this.resolved !== undefined) {
        callback.apply(this.context, this.resolved);
      } 
      else {
        this.callbacks.push(callback);
      }
    };

    Promise.prototype.resolve = function() {
      if (this.resolved) throw new Error('Promise already resolved');
      
      var self = this;
      this.resolved = arguments;
      
      _.each(this.callbacks, function(callback) {
        callback.apply(self.context, self.resolved);
      });
    };
      
})();