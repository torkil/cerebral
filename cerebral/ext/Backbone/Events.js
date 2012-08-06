
/**
  Factory that creates Events object for extending Backbone.Events and Backbone.Model|Collection|View|Router.prototype
  @exports EventsFactory
*/
define(
"cerebral/ext/Backbone/Events", [
  "underscore"
],
function( _ ) {
  
  var Events

  Events = {}

  /**
    Alias trigger as emit
    @public
    @type Function
    @returns {Mixed} self
  */
  Events.emit = function() {
    this.trigger.apply( this, arguments )
    return this
  }

  /**
    Alias on as addEventListener
    @public
    @type Function
    @returns {Mixed} self
  */
  Events.addEventListener = function() {
    this.on.apply( this, arguments )
  }

  /**
    Alias off as removeEventListener
    @public
    @type Function
    @returns {Mixed} self
  */
  Events.removeEventListener = function() {
    this.off.apply( this, arguments )
  }

  /**
    Register a event handler and unbind it on the first time it fires
    @private
    @type Function
    @param {String} event The event to bind to
    @param {Function} callback The callback to bind
    @param {Object} context The context, this value of the callback
    @returns {Mixed} self
  */
  Events.once = function( event, callback, context ) {
    var fn

    fn = _.bind(function() {
      callback.apply( context || this, arguments )
      this.off( event, fn )
    }, this)
    
    this.on( event, fn )
  }

  /**
    Unbinds listeners, delegates to the the appropriate private method based on parameters
    @public
    @type Function
    @param {Object} obj The object to unbind from
    @param {String} [event] The event to unbind events from
    @param {Function} [callback] The callback to unbind
    @returns {Mixed} self
  */
  Events.unbindFrom = function( obj, event, callback ) {
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
    @returns {Mixed} self
  */
  Events.unbindAll = function() {
    var i, binding

    for ( i = this.bindings.length - 1; i >= 0; i-- ) {
      binding = this.bindings[i]
      binding.obj.unbind( binding.event, binding.callback )
    }
    this.bindings = []

    return this
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
    Binds a callback to be called when the given event fires on the given object
    @public
    @type Function
    @param {Object} obj The object to bind to
    @param {String} event The event to listen to
    @param {Function} callback The callback to fire when the event emits on the object
    @returns {Mixed} self
  */
  Events.bindTo = function( obj, event, callback, context ) {
    if( !this.bindings )
      this.bindings = []

    obj.bind( event, callback, context || this )
    this.bindings.push({
      obj: obj,
      event: event,
      callback: callback
    })

    return this
  }

  /**
    Binds a callback to be called when the given event fires on the given object
    @public
    @type Function
    @param {Object} obj The object to bind to
    @param {String} event The event to listen to
    @param {Function} callback The callback to fire when the event emits on the object
    @returns {Mixed} self
  */
  Events.bindToOnce = function( obj, event, callback, context ) {
    var self, _callback

    self = this
    _callback = function() {
      callback.apply( this, arguments )
      self.unbindFrom( obj, event, _callback )
    }

    if( !this.bindings )
      this.bindings = []

    this.bindTo( obj, event, _callback, context )

    return this
  }

  return Events
})