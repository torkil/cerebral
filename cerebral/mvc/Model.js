
/**
  @class Base Model class, for data models
  @exports cerebral/mvc/Model
  @extends Backbone.Model
  @requires [Backbone]
*/
define("cerebral/mvc/Model", [
  "backbone",
  "cerebral/ext/BackboneEvents"
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