define("cerebral/lib/Backbone",[
  "underscore",
  "backbone",
  "cerebral/ext/Backbone/Events"
], function( _, Backbone, Events ){
  
  _.extend( Backbone.Events, Events )
  _.extend( Backbone.Model.prototype, Events )
  _.extend( Backbone.Collection.prototype, Events )
  _.extend( Backbone.View.prototype, Events )
  _.extend( Backbone.Router.prototype, Events )

  return Backbone
})