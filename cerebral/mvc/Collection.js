
/**
  @class Collection Collection of moddels.
  @extends Backbone.Collection
  @see Backbone.js Collection
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
    @property {Array} bindings Event bindings. Used by Backbone.View.prototype to handle events.
  */
  var Collection = Backbone.Collection.extend({
    constructor: function() {

      this.bindings = []
      
      Backbone.Collection.prototype.constructor.apply( this, arguments )
    }
  })

  return Collection
})