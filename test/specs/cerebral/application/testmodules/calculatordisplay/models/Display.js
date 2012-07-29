define([
  'sandbox',
  'cerebral/mvc/Model'
], 
function( sandbox, Model ) {
  
  var DisplayModel = Model.extend({
    getSandbox: function() {
      return sandbox
    }
  })

  return DisplayModel
})