
/**
  @class Base Collection class, for collections of models
  @exports cerebral/mvc/Collection
  @extends Backbone.Collection
  @requires [Backbone]
*/
define(
"cerebral/mvc/Collection", [
  "cerebral/lib/Backbone"
],
function( Backbone ) {
  
  /**
    Creates a new Collection
    @public
    @constructor
  */
  var Collection = Backbone.Collection.extend({})

  return Collection
})