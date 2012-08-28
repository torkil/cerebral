
 require([
  "cerebral/application/classes/Module",
  "cerebral/application/sandbox/factory"
], function( Module, sandboxfactory ) {

  var originalPrototype = sandboxfactory.sandboxprototype

  describe("cerebral/application/sandbox/factory", function() {

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


    describe("pub-sub permissions", function() {

      it("should restrict subscriptions based on the sandboxfactory.permissions hash.", function() {

        sandboxfactory.permissions.extend({
          "admin": {
            "user": true
          },
          "user": {
            "admin": false
          }
        })
        
        var adminSB = sandboxfactory.create({
          module: new Module({ root: '/', name: 'admin' })
        })

        var userSB = sandboxfactory.create({
          module: new Module({ root: '/', name: 'user' })
        })

        userSB.subscribe("admin", function() { 
          throw new Error( "should not be able to subscribe to admin" ) 
        })
        userSB.subscribe("admin::sudoOperation", function() { 
          throw new Error( "should not be able to subscribe to this admin::sudoOperation" ) 
        })
        
        userSB.publish( "admin" )
        userSB.publish( "admin::sudoOperation" )

      })

    })


  })

})