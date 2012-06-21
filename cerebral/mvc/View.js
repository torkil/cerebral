define([
  "backbone",
  "cerebral/mvc/ViewCollection"
], 
function(Backbone, ViewCollection){

  var View = Backbone.View.extend({
    constructor: function() {
      this.subviews = new ViewCollection({
        superview: this
      })
      if(typeof this.initialize === 'function')
        this.initialize.apply(this, arguments)
    }
  })



  return View
})