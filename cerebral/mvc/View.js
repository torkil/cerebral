define(
"cerebral/mvc/View",[
  "backbone",
  "cerebral/mvc/ViewCollection"
], 
function(Backbone, ViewCollection){

  var View = Backbone.View.extend({
    constructor: function() {
      Backbone.View.prototype.constructor.apply( this, arguments )
      this.bindings = []
      this.subviews = new ViewCollection()
      if( typeof this.initialize === 'function' )
        this.initialize.apply(this, arguments)
    }
  })

  View.prototype.bindTo = function( model, event, callback ) {
    model.bind( event, callback, this )
    this.bindings.push({
      model: model,
      event: event,
      callback: callback
    })
  }

  View.prototype.unbindFromAll = function() {
    _.each(this.bindings, function( binding ) {
      binding.model.unbind( binding.event, binding.callback )
    })
    this.bindings = []
  }

  View.prototype.dispose = function() {
    this.unbindFromAll()
    this.unbind()
    this.remove()
  }
  
  return View
})