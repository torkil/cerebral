define(
"cerebral/mvc/View",[
  "backbone",
  "cerebral/mvc/SubviewCollection"
], 
function(Backbone, SubviewCollection){

  var View = Backbone.View.extend({
    constructor: function() {
      Backbone.View.prototype.constructor.apply( this, arguments )
      this.bindings = []
      this.subviews = new SubviewCollection()
      if( typeof this.initialize === 'function' )
        this.initialize.apply(this, arguments)
    }
  })

  View.prototype.bindTo = function( obj, event, callback ) {
    obj.bind( event, callback, this )
    this.bindings.push({
      obj: obj,
      event: event,
      callback: callback
    })
    return this
  }

  function unbindSpecificCallback( obj, event, callback ) {
    return _.filter(this.bindings, function( binding, index ) {
      if( binding.obj === obj && binding.event === event && binding.callback === callback ) {
        binding.obj.unbind( binding.event, binding.callback )
      } else {
        return true
      }
    }, this)
  }

  function unbindSpecificEvent( obj, event ) {
    return _.filter(this.bindings, function( binding, index ) {
      if( binding.obj === obj && binding.event === event ) {
        binding.obj.unbind( binding.event, binding.callback )
      } else {
        return true
      }
    }, this) 
  }
    
  function unbindAllOnObject( obj ) {
    return _.filter(this.bindings, function( binding, index ) {
      if( binding.obj === obj ) {
        binding.obj.unbind( binding.event, binding.callback )
      } else {
        return true
      }
    }, this)
  }
    
  View.prototype.unbindFrom = function( obj, event, callback ) {
    if( arguments.length === 3 )
      this.bindings = unbindSpecificCallback.apply( this, arguments )
    if( arguments.length === 2 )
      this.bindings = unbindSpecificEvent.apply( this, arguments )
    if( arguments.length === 1 )
      this.bindings = unbindAllOnObject.apply( this, arguments )
    return this
  }

  View.prototype.unbindAll = function() {
    _.each(this.bindings, function( binding ) {
      binding.obj.unbind( binding.event, binding.callback )
    })
    this.bindings = []
    return this
  }

  View.prototype.dispose = function() {
    this.removeAllListeners()
    this.unbind()
    this.remove()
    this.trigger('dispose')
    return this
  }
  
  return View
})