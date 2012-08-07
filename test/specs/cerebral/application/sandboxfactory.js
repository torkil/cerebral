
 require([
  "cerebral/application/sandboxfactory"
], function( sandboxfactory ) {

  var originalPrototype = sandboxfactory.sandboxprototype

  describe("sandboxfactory", function() {

    describe("sandboxfactory.create", function() {

      it("should return an object that has sandboxfactory.sandboxprototype as prototype", function() {

        var proto = { protoprop: 'lol' }

        sandboxfactory.sandboxprototype = proto

        var sb = sandboxfactory.create()

        expect( Object.getPrototypeOf( sb ) ).to.equal( proto )

        sandboxfactory.sandboxprototype = originalPrototype

      })

      it("should set all properties set on first parameter attributes on the sandbox", function() {

        var sb = sandboxfactory.create({
          foo: 'lol',
          lorem: function() { return 'ipsum' }
        })

        expect( sb.foo ).to.equal( 'lol' )
        expect( sb.lorem() ).to.equal( 'ipsum' )
        
      })

    })


  })

})