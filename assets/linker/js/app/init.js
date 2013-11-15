Backbone.Marionette.Renderer.render = function(template, data){
  if (!JST[template]) throw "Template '" + template + "' not found!";
  return JST[template](data);
}

var TwitterApp = new Backbone.Marionette.Application();

TwitterApp.addRegions({
  container: "#container"
});