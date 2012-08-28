
require([
  "cerebral/application/classes/Interface"
],
function( Interface ) {

  describe("cerebral/application/classes/Interface", function() {

    describe("Interface.prototype.connected", function() {

      it("should fire the callback if it is connected and with itself as this", function() {

        var interface = new Interface({
          foo: function() { return 'bar' }
        })

      })

    })

  })

})