
require([
  "cerebral/application/classes/Module",
  "cerebral/application/sandbox/factory"
], 
function( Module, sandboxfactory ) {

  describe("cerebral/application/sandbox/factory methods", function() {


    describe("sandbox.requestInterface", function() {

      var sandbox
      beforeEach(function() {

        sandbox = sandboxfactory.create({
          module: new Module({ root: 'modules', name: 'interfacable' })
        })

      })

      it("should invoke the callback with an error as first parameter if the interface isnt registered", function( done ) {

        sandbox.requestInterface("interfacable::nonexistant", function( err, api ) {

          try {
            expect( err ).to.be.an( Error )
          } catch( exception ) {
            done( exception )
          }

          done()
        })

      })

    })

    describe("sandbox.defineInterface", function() {

      var sandbox
      beforeEach(function() {

        sandbox = sandboxfactory.create({
          module: new Module({ root: 'modules', name: 'interfacable' })
        })

      })

      it("should throw an error if a module tries to register a interface with a name that is not within its own namespace", function( done ) {

        expect( function() {
          sandbox.defineInterface("restricted::module::api", {})
        })
        .to.throwException(function( exception ) {

          done()

        })
        

      })

      it("should define a interface and send the definition to the callback of sandbox.requestInterface", function( done ) {

        sandbox.defineInterface("interfacable::api", {
          foo: function() { return 'bar' }
        })

        sandbox.requestInterface("interfacable::api", function( error, api ) {
          try {

            expect( api ).to.be.an( Object )
            expect( api.foo ).to.be.an( Function )
            expect( api.foo() ).to.equal( 'bar' )

          } catch( exception ) {
            done( exception )
          }

          done()
        })

      })

    })
    

  })

})