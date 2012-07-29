require([
  "cerebral/application/core"
], function( core ) {
  
  window._core = core

  var moduleRoot = 'test/specs/cerebral/application/testmodules/'

  core.configure({
    moduleRoot: moduleRoot
  })

  function unloadAll() {
    core.unloadModule('calculatordisplay')
    core.unloadModule('calculatorinput')
    core.unloadModule('faultyreturn')
    core.unloadModule('mainreporter')
  }
  
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

    describe("core.loadModule", function() {

      beforeEach( unloadAll )

      it("should use amd loading to load a module from the desired namespace", function( done ) {

        core.loadModule({
          modulename: 'mainreporter'
        }, 
        function( err, mainreporter ) {
          expect( mainreporter ).to.be.ok()
          expect( mainreporter() ).to.equal( 'main' )
          done()
        })

      })

      it("should pass a TypeError if the module definition is of other type than function", function( done ) {

        core.loadModule({
          modulename: 'faultyreturn'
        }, 
        function( err ) {
          expect( err ).to.be.a( TypeError )
          done()
        })

      })

      it("should pass a Error if the module doesnt exist", function( done ) {

        core.loadModule({
          modulename: 'nonexisting'
        }, 
        function( err ) {
          expect( err ).to.be.a( Error )
          done()
        })

      })

    })

    describe("core.unloadModule", function() {

      beforeEach( unloadAll )

      it("should unload all modules that are within the namespace of the module and defined by the amd loader", function( done ) {

        core.loadModule({ 
          modulename: 'calculatordisplay'
        }, 
        function( err, display ) {

          expect( display ).to.be.a( 'function' )
          expect( require.defined(moduleRoot + 'calculatordisplay/main') ).to.equal( true )
          expect( require.defined(moduleRoot + 'calculatordisplay/models/Display') ).to.equal( true )
          expect( require.defined(moduleRoot + 'calculatordisplay/views/Display') ).to.equal( true )
          expect( require.defined('cerebral/mvc/Model') ).to.equal( true )

          core.unloadModule('calculatordisplay')

          expect( require.defined(moduleRoot + 'calculatordisplay/main') ).to.equal( false )
          expect( require.defined(moduleRoot + 'calculatordisplay/models/Display') ).to.equal( false )
          expect( require.defined(moduleRoot + 'calculatordisplay/views/Display') ).to.equal( false )
          expect( require.defined('cerebral/mvc/Model') ).to.equal( true )

          done()
        })

      })

    })

    describe("core.start", function() {

      beforeEach( unloadAll )

      it("should invoke the main function of the module", function( done ) {

        var timeout

        TESTDATA.calculatordisplay = {
          'onMain': function() {
            clearTimeout( timeout )
            done()
          }
        }

        timeout = setTimeout(function() {
          done( new Error('core.start timeout') )
        }, 500)

        core.start('calculatordisplay', {
          el: '#calculatordisplay'
        })

      })

      it("should not invoke the main method if the module is allready started", function( done ) {

        var incrementer, continuation

        incrementer = 0

        TESTDATA.calculatordisplay = {
          'onMain': function() {
            incrementer++

            if(continuation) continuation()
          }
        }

        core.start('calculatordisplay', {
          el: '#calculatordisplay'
        })

        continuation = function() {
          expect( incrementer ).to.equal( 1 )
          
          continuation = function() {
            expect( incrementer ).to.equal( 1 )
            done()
          }

          core.start('calculatordisplay', {
            el: '#calculatordisplay'
          })

          setTimeout(continuation, 120)

        }

      })

      it("should have access to a sandbox object under 'sandbox' namespace under the moduleroot namespace", function( done ) {

        var timeout

        TESTDATA.calculatordisplay = {
          'compareSandboxes': function( sandboxes ) {
            clearTimeout( timeout )

            expect( sandboxes.mainSandbox === sandboxes.subSandbox ).to.equal( true )

            done()
          }
        }

        timeout = setTimeout(function() {
          done( new Error('core.start timeout') )
        }, 500)

        core.start('calculatordisplay', {
          el: '#calculatorinput'
        })

      })

    })

  })

})