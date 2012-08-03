define([
  "admin/sandbox",
  "./View"
], function( sandbox, View ){
  
  return function main() {

    var adminView = new View({
      el: sandbox.element
    })

    adminView.render()

  }

})