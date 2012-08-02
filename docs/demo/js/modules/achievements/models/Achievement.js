
define([
  "sandbox",
  "cerebral/mvc/Model"
], 
function( sandbox, Model ){
  
  var Achievement

  Achievement = Model.extend({
    complete: function() {
      this.set( "completed", true )
    }
  })

  return Achievement
})