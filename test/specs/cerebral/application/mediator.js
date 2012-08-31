
require([
  "cerebral/application/mediator",
  "cerebral/application/classes/Interface"
], 
function( mediator, Interface ) {
  
  describe("cerebral/application/mediator", function() {
    

    describe("cores.subscribe", function() {
      
      it("should bind the third context callback as the this value for the callback", function() {
        
        var _this, that

        _this = { foo: 'bar' }

        mediator.subscribe("context", function() {
          that = this
        }, _this)

        mediator.publish( "context" )

        expect( _this ).to.equal( that )
        expect( that["foo"] ).to.equal( "bar" )

      })

      it("should attach a listener to the subscription if one is given, else it should be null", function() {

        var listener = {}

        mediator.subscribe( "listener-obj", function() {}, null, listener )
        mediator.subscribe( "listener-null", function() {} )

        var channels = mediator.__getChannels()

        expect( channels['listener-obj'][0].listener ).to.equal( listener )
        expect( channels['listener-null'][0].listener ).to.equal( null )

      })

    })

    describe("mediator.publish", function() {
      
      it("should fire all subscribing callbacks with the arguments.. after channel", function() {
        
        var a, b, c

        mediator.subscribe("abc", function( _a, _b, _c) {
          a = _a
          b = _b
          c = _c
        })

        mediator.publish( "abc", 'a', 'b', 'c' )

        expect( a ).to.equal( "a" )
        expect( b ).to.equal( "b" )
        expect( c ).to.equal( "c" )

      })

    })


    describe("mediator.unsubscribe", function() {
      
      it("should remove all callbacks if only channel is given", function() {

        var calls = 0

        mediator.subscribe( "foo", function() { calls++ } )
        mediator.subscribe( "foo", function() { calls++ } )
        mediator.subscribe( "foo", function() { calls++ } )

        mediator.publish("foo")
        expect( calls ).to.equal( 3 )

        mediator.unsubscribe( "foo" )

        mediator.publish("foo")
        expect( calls ).to.equal( 3 )

      })

      it("should remove a specific subscription that has the callback specified in parameters", function() {
        
        var i, callback

        i = 0
        callback = function() { i++ }

        mediator.subscribe( "increment", callback )

        mediator.publish( "increment" )
        mediator.publish( "increment" )

        expect( i ).to.equal( 2 )

        mediator.unsubscribe( "increment", callback )

        mediator.publish( "increment" )

        expect( i ).to.equal( 2 )

      })

      it("should remove all callbacks asociated with a specific listener if a listener is specified in the parameters", function() {

        var listenerA, listenerB, i

        listenerA = {}
        listenerB = {}

        i = 0

        mediator.subscribe( "increment-two", function() { i++ }, null, listenerA )
        mediator.subscribe( "increment-two", function() { i++ }, null, listenerB )
        expect( mediator.__getChannels()['increment-two'].length ).to.equal( 2 )

        mediator.publish( "increment-two" )
        expect( i ).to.equal( 2 )

        mediator.unsubscribe( "increment-two", null, listenerA ) 
        expect( mediator.__getChannels()['increment-two'].length ).to.equal( 1 )

        mediator.publish( "increment-two" )
        expect( i ).to.equal( 3 )

        mediator.unsubscribe( "increment-two", null, listenerB )
        expect( mediator.__getChannels()['increment-two'] ).to.equal( undefined )

        mediator.publish( "increment-two" )
        expect( i ).to.equal( 3 )

      })

      it("should only remove callbacks where both callback and listener is matching parameters if both is given", function() {
        
        var listenerA, listenerB, i

        listenerA = {}
        listenerB = {}

        i = 0

        function sharedCallback() { i++ }

        mediator.subscribe( "match", sharedCallback, null, listenerA )
        mediator.subscribe( "match", sharedCallback, null, listenerB )

        mediator.publish( "match" )
        expect( i ).to.equal( 2 )

        mediator.unsubscribe( "match", sharedCallback, listenerA )

        mediator.publish( "match" )
        expect( i ).to.equal( 3 )

      })

      it("should remove all subscriptions to given channel that match listener if only listener is given", function() {

        var i, listener

        i = 0
        listener = {}

        mediator.subscribe( "hell-of-alot", function() { i++ }, null, listener )
        mediator.subscribe( "hell-of-alot", function() { i++ }, null, listener )
        mediator.subscribe( "hell-of-alot", function() { i++ }, null, listener )

        mediator.publish( "hell-of-alot" )
        mediator.publish( "hell-of-alot" )
        mediator.publish( "hell-of-alot" )

        expect( i ).to.equal( 9 )

        mediator.unsubscribe( "hell-of-alot", null, listener )

        mediator.publish( "hell-of-alot" )

        expect( i ).to.equal( 9 )

      })

      it("should remove all subscriptions for a listener of only a listener is given", function() {

        var listener = { name: 'listener' }

        mediator.subscribe( "only-listener-a", function() {}, null, listener)
        mediator.subscribe( "only-listener-a", function() {}, null, listener)
        mediator.subscribe( "only-listener-b", function() {}, null, listener)
        mediator.subscribe( "only-listener-b", function() {}, null, listener)

        expect( mediator.__getChannels()['only-listener-a'].length ).to.equal( 2 )
        expect( mediator.__getChannels()['only-listener-b'].length ).to.equal( 2 )

        mediator.unsubscribe( null, null, listener )

        expect( mediator.__getChannels()['only-listener-a'] ).to.equal( undefined )
        expect( mediator.__getChannels()['only-listener-b'] ).to.equal( undefined )

      })

    })
    
    describe("namespaces", function() {

      describe("mediator.namespaceMatch", function() {

        it("should", function() {

          expect( mediator.namespaceMatch("foo", "foo") ).to.equal( true )  
          expect( mediator.namespaceMatch("foo::bar", "foo") ).to.equal( true )
          expect( mediator.namespaceMatch("foo::bar::lol", "foo") ).to.equal( true )

          expect( mediator.namespaceMatch("foo::bar", "foo::bar") ).to.equal( true )  
          expect( mediator.namespaceMatch("foo::bar::nice", "foo::bar") ).to.equal( true )  
          expect( mediator.namespaceMatch("not::bar::nice", "foo::bar") ).to.equal( false )  

        })
        

      })

      it("should fire all subscribers where where subscriber namespace is within the published namespace", function() {

        var stat = {
          "foo": 0,
          "foo::bar": 0,
          "foo::bar::lol": 0
        }

        mediator.subscribe("foo",           function( n ) { stat["foo"] += n })
        mediator.subscribe("foo::bar",      function( n ) { stat["foo::bar"] += n })
        mediator.subscribe("foo::bar::lol", function( n ) { stat["foo::bar::lol"] += n })
        
        mediator.publish("foo", 1)
        mediator.publish("foo::bar", 1)
        mediator.publish("foo::bar::lol", 1)

        expect( stat["foo"] ).to.equal( 3 )
        expect( stat["foo::bar"] ).to.equal( 2 )
        expect( stat["foo::bar::lol"] ).to.equal( 1 )

      })

      it("should remove all subscribers where where subscriber namespace is within the unsubscribed namespace", function() {

        var stat = {
          "foo": 0,
          "foo::bar": 0,
          "foo::bar::lol": 0
        }

        mediator.subscribe("foo",           function( n ) { stat["foo"] += n })
        mediator.subscribe("foo::bar",      function( n ) { stat["foo::bar"] += n })
        mediator.subscribe("foo::bar::lol", function( n ) { stat["foo::bar::lol"] += n })
        
        mediator.publish("foo", 1)
        mediator.publish("foo::bar", 1)
        mediator.publish("foo::bar::lol", 1)

        expect( stat["foo"] ).to.equal( 3 )
        expect( stat["foo::bar"] ).to.equal( 2 )
        expect( stat["foo::bar::lol"] ).to.equal( 1 )

        mediator.unsubscribe("foo")

        mediator.publish("foo", 1)
        mediator.publish("foo::bar", 1)
        mediator.publish("foo::bar::lol", 1)

        expect( stat["foo"] ).to.equal( 3 )
        expect( stat["foo::bar"] ).to.equal( 2 )
        expect( stat["foo::bar::lol"] ).to.equal( 1 )

      })

    })
    
    describe("mediator.registerInterface", function() { 

      

    })

    describe("mediator.requestInterface", function() { 

      it("should return the interface if it is found and there is no callback", function() {

        mediator.registerInterface("lol::cat", "hascheez")
        mediator.registerInterface("lol::obj", {
          cat: 'sylvester',
          cheese: 'jarlsberger'
        })

        expect( mediator.requestInterface("lol::cat") ).to.equal( "hascheez" )
        expect( mediator.requestInterface("lol::obj") ).to.eql({
          cat: 'sylvester',
          cheese: 'jarlsberger'
        })

      })

      it("should return what is returned from the callback if there is a callback", function() {

        mediator.registerInterface("does::exist", { foo: function() { return 'foo' } })

        var foo = mediator.requestInterface("does::exist", function( err, interface ) {
          return interface.foo
        })

        var lorem = mediator.requestInterface("doesnt::exist", function( err, interface ) {
          expect( err ).to.be.an( Error )
          return "lorem"
        })

        expect( foo() ).to.equal( 'foo' )
        expect( lorem ).to.equal( 'lorem' )

      })

      it("should receive an error with code 400 if the interface does not exist", function( done ) {

        mediator.requestInterface("doesnt::exist", function( err, interface ) {
          try {
            expect( err ).to.be.an( Error )
            expect( err.code ).to.equal( 400 )
          } catch( error ) {
            done( error )
          }
          done()
        })

      })

      it("should return the error if it wasnt found and there is no callback", function() {

        var err = mediator.requestInterface( "doesnt::exist" )

        expect( err ).to.be.an( Error )
        expect( err.code ).to.equal( 400 )

      })

    })

    
  })

})