
/**
  @class The base view
  @exports cerebral/mvc/View
  @extends Backbone.View
  @requires [underscore, Backbone, cerebral/mvc/ViewCollection]
*/

define(
"cerebral/mvc/View",[
  "underscore",
  "backbone",
  "cerebral/mvc/ViewCollection"
], 
function( _,Backbone, ViewCollection ) {
  
  /**
    Creates a new View
    @public
    @constructor
    @property {Array} bindings Array of the listeners this view is listening to
    @property {cerebral/mvc/ViewCollection} subviews
  */
  var View = Backbone.View.extend({
    constructor: function() {
      this.bindings = []
      this.subviews = new ViewCollection()
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
    Binds a callback to be called when the given event fires on the given object
    @public
    @type Function
    @param {Object} obj The object to bind to
    @param {String} event The event to listen to
    @param {Function} callback The callback to fire when the event emits on the object
    @returns {cerebral/mvc/View} self
  */
  View.prototype.bindTo = function( obj, event, callback ) {
    obj.bind( event, callback, this )
    this.bindings.push({
      obj: obj,
      event: event,
      callback: callback
    })
    return this
  }

  /**
    Unbinds a specific callback to a specific event on a specific object
    @private
    @type Function
    @param {Object} obj The object to unbind from
    @param {String} event The event to unbind events from
    @param {Function} callback The callback to unbind
    @returns {Array} bindings The bindings that didnt match the test
  */
  function unbindSpecificCallback( obj, event, callback ) {
    return _.filter(this.bindings, function( binding, index ) {
      if( binding.obj === obj && binding.event === event && binding.callback === callback ) {
        binding.obj.unbind( binding.event, binding.callback )
      } else {
        return true
      }
    }, this)
  }

  /**
    Unbinds all callbacks to a specific event on a specific object
    @private
    @type Function
    @param {Object} obj The object to unbind from
    @param {String} event The event to unbind events from
    @returns {Array} bindings The bindings that didnt match the test
  */
  function unbindSpecificEvent( obj, event ) {
    return _.filter(this.bindings, function( binding, index ) {
      if( binding.obj === obj && binding.event === event ) {
        binding.obj.unbind( binding.event, binding.callback )
      } else {
        return true
      }
    }, this) 
  }
  
  /**
    Unbinds all callbacks to all avents on a specific obj
    @private
    @type Function
    @param {Object} obj The object to unbind from
    @returns {Array} bindings The bindings that didnt match the test
  */
  function unbindAllOnObject( obj ) {
    return _.filter(this.bindings, function( binding, index ) {
      if( binding.obj === obj ) {
        binding.obj.unbind( binding.event, binding.callback )
      } else {
        return true
      }
    }, this)
  }
  
  /**
    Unbinds listeners, delegates to the the appropriate private method based on parameters
    @public
    @type Function
    @param {Object} obj The object to unbind from
    @param {String} [event] The event to unbind events from
    @param {Function} [callback] The callback to unbind
  */
  View.prototype.unbindFrom = function( obj, event, callback ) {
    if( arguments.length === 3 )
      this.bindings = unbindSpecificCallback.apply( this, arguments )
    if( arguments.length === 2 )
      this.bindings = unbindSpecificEvent.apply( this, arguments )
    if( arguments.length === 1 )
      this.bindings = unbindAllOnObject.apply( this, arguments )
    return this
  }

  /**
    Unbinds all listeners
    @public
    @type Function
  */
  View.prototype.unbindAll = function() {
    _.each(this.bindings, function( binding ) {
      binding.obj.unbind( binding.event, binding.callback )
    })
    this.bindings = []
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
    this.unbindAll()
    this.unbind()
    this.remove()
    return this
  }
  
  return View
})