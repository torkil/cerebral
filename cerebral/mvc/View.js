
/**
  @class The base view
  @exports cerebral/mvc/View
  @extends Backbone.View
  @requires [underscore, Backbone, cerebral/mvc/SubviewCollection]
*/

define("cerebral/mvc/View",[
  "underscore",
  "backbone",
  "cerebral/mvc/SubviewCollection"
], 
function( _,Backbone, SubviewCollection ) {
  
  /**
    Creates a new View
    @public
    @constructor
    @property {Array} bindings Array of the listeners this view is listening to
    @property {cerebral/mvc/SubviewCollection} subviews
  */
  var View = Backbone.View.extend({
    constructor: function() {
      Backbone.View.prototype.constructor.apply( this, arguments )
      this.bindings = []
      this.subviews = new SubviewCollection()
      if( typeof this.initialize === 'function' )
        this.initialize.apply(this, arguments)
    }
  })

  /**
    Binds a callback to when the given event emits on the given object
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
    @returns {Array} bindings
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
    @returns {Array} bindings
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
    @returns {Array} bindings
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
    Unbinds listeners, calls the appropriate private method based on parameters
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
    @type Function
  */
  View.prototype.dispose = function() {
    this.unbindAll()
    this.unbind()
    this.remove()
    this.trigger('dispose')
    return this
  }
  
  return View
})