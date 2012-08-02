
define([
  "sandbox",
  "underscore",
  "cerebral/mvc/Collection",
  "../models/Achievement"
], 
function( sandbox, _, Collection, Achievement ){
  
  var Achievements

  Achievements = Collection.extend({
    
    model: Achievement,

    complete: function( filter ) {
      var completed = this.where( filter )
      _(completed).invoke( "complete" )
    }

  })

  return Achievements
})