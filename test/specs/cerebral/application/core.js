require([
  "cerebral/application/core"
], function( core ) {
  
  describe("cerebral/application/core", function() {
    
    describe("core.publish", function() {
      
      it("should fire all subscribing callbacks with the arguments.. after channel", function() {
        
        var a, b, c

        core.subscribe("abc", function( _a, _b, _c) {
          a = _a
          b = _b
          c = _c
        })

        core.publish( "abc", 'a', 'b', 'c' )

        expect( a ).to.equal( "a" )
        expect( b ).to.equal( "b" )
        expect( c ).to.equal( "c" )

      })

    })

    describe("cores.subscribe", function() {
      
      it("should bind the third context callback as the this value for the callback", function() {
        
        var _this, that

        _this = { foo: 'bar' }

        core.subscribe("context", function() {
          that = this
        }, _this)

        core.publish( "context" )

        expect( _this ).to.equal( that )
        expect( that["foo"] ).to.equal( "bar" )

      })

    })

    describe("core.unsubscribe", function() {
      
      it("should remove the specific callback associated with a channel and prevent it from firing on publish to that channel", function() {
        
        var i, callback

        i = 0
        callback = function() { i++ }

        core.subscribe( "increment", callback )

        core.publish( "increment" )
        core.publish( "increment" )

        expect( i ).to.equal( 2 )

        core.unsubscribe( "increment", callback )

        core.publish( "increment" )

        expect( i ).to.equal( 2 )

      })

    })

  })

})