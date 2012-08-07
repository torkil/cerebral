
/**
  @class View Class for managing views
  @extends Backbone.View
  @see Backbone.js View
  @requires [underscore, cerebral/lib/Backbone, cerebral/mvc/ViewCollection]
  @exports View
*/
define(
"cerebral/mvc/View", [
  "underscore",
  "cerebral/lib/Backbone",
  "cerebral/mvc/ViewCollection"
], 
function( _,Backbone, ViewCollection ) {
  
  /**
    Creates a new View
    @public
    @constructor
    @property {cerebral/mvc/ViewCollection} subviews
    @property {Array} bindings Event bindings. Used by Backbone.View.prototype to handle events.
  */
  var View = Backbone.View.extend({
    constructor: function() {

      this.subviews = new ViewCollection()
      this.bindings = []

      Backbone.View.prototype.constructor.apply( this, arguments )
    }
  })

  /**
    Ref Backbone.View.prototype.setElement, augments to fire a #setelement event
    @public
    @type Function
    @event #setelement [view]
    @augments Backbone.View.prototype.setElement
  */
  View.prototype.setElement = function() {
    Backbone.View.prototype.setElement.apply( this, arguments )
    this.trigger( "setelement", this )
    
    return this
  }

  /**
    Unbinds all listeners, all DOM event listeners, removes the view.$el from the DOM and triggers "dispose"
    @public
    @event #dispose [view]
    @type Function
  */
  View.prototype.dispose = function() {
    this.unbindAll()
    this.subviews.invoke( 'dispose' )
    this.subviews.detachAll()
    this.remove()
    this.trigger( 'dispose', this )
    delete this.el
    return this
  }
  
  return View
})