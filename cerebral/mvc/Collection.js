
/**
  @class Base Collection class, for collections of models
  @extends Backbone.Collection
  @requires [Backbone]
  @exports Collection
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