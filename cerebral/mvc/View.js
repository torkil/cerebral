
/**
  @class The base view
  @extends Backbone.View
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
  */
  var View = Backbone.View.extend({
    constructor: function() {
      Backbone.View.prototype.constructor.apply( this, arguments )
      this.subviews = new ViewCollection()
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
    this.trigger('dispose', this)
    this.subviews.invoke( 'dispose' )
    this.unbindAll()
    this.unbind()
    this.remove()

    return this
  }
  
  return View
})