
/**
  @class Base Model class, for data models
  @exports cerebral/mvc/Model
  @extends Backbone.Model
  @requires [cerebral/lib/Backbone]
*/
define(
"cerebral/mvc/Model", [
  "cerebral/lib/Backbone"
],
function( Backbone ) {
  
  /**
    Creates a new Model
    @public
    @constructor
  */
  var Model = Backbone.Model.extend({})

  return Model
})