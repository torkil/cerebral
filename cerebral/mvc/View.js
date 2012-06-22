define(
"cerebral/mvc/View",[
  "backbone",
  "cerebral/mvc/ViewCollection"
], 
function(Backbone, ViewCollection){

  var View = Backbone.View.extend({
    constructor: function() {
      Backbone.View.prototype.constructor.apply(this, arguments)
      this.subviews = new ViewCollection({
        superview: this
      })
      if(typeof this.initialize === 'function')
        this.initialize.apply(this, arguments)
    }
  })
  window.View = View
  return View
})