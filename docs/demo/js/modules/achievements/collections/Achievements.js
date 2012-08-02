
define([
  "sandbox",
  "cerebral/mvc/Collection",
  "../models/Achievement"
], 
function( sandbox, Collection, Achievement ){
  
  var Achievements

  Achievements = Collection.extend({
    
    model: Achievement

  })

  return Achievements
})