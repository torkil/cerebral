
/**
  Extending Backbone
  @augments Backbone
  @requires [underscore, cerebral/vendor/Backbone, cerebral/ext/Backbone/Events]
  @exports Backbone
*/
define(
"cerebral/lib/Backbone",[
  "underscore",
  "backbone",
  "cerebral/ext/Backbone/Events"
], function( _, Backbone, EventsExt ){
  
  /*
    Extend the Backbone.Events object with the Events extension
  */
  _.extend( Backbone.Events, EventsExt )

  /*
    Because Backbone.Events isnt the direct prototype object of Backbone.Model|Collection|View|Router
    we have to extend their prototypes directly with the Events extension
  */
  _.extend( Backbone.Model.prototype, EventsExt )
  _.extend( Backbone.Collection.prototype, EventsExt )
  _.extend( Backbone.View.prototype, EventsExt )
  _.extend( Backbone.Router.prototype, EventsExt )

  return Backbone
})