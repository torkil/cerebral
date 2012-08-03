
 require([
  "cerebral/application/core"
], function( core ) {
  
  window._core = core

  var moduleRoot = 'test/specs/cerebral/application/testmodules/'

  core.configure({
    moduleRoot: moduleRoot
  })

  function reset() {
    $('#app_test').html( $('#app_test_template').html() )
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

    describe("modules", function() {

      beforeEach( reset )

      describe("core.loadModule", function() {

        beforeEach( reset )

        it("should use amd loading to load a module from the desired namespace", function( done ) {

          core.loadModule({
            name: 'mainreporter'
          }, 
          function( err, mainreporter ) {
            expect( mainreporter.main ).to.be.ok()
            expect( mainreporter.main() ).to.equal( 'main' )
            done()
          })

        })

        it("should pass a TypeError if the module definition is of other type than function or object", function( done ) {

          core.loadModule({
            name: 'faultyreturn'
          }, 
          function( err ) {
            expect( err ).to.be.a( TypeError )
            done()
          })

        })

        it("should pass a Error if the module doesnt exist", function( done ) {

          core.loadModule({
            name: 'nonexisting'
          }, 
          function( err ) {
            expect( err ).to.be.a( Error )
            done()
          })

        })

      })

      describe("core.unloadModule", function() {

        beforeEach( reset )

        it("should unload all modules that are within the namespace of the module and defined by the amd loader", function( done ) {

          core.loadModule({ 
            name: 'calculatordisplay'
          }, 
          function( err, display ) {

            expect( display.main ).to.be.a( 'function' )
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

        beforeEach( reset )

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
            element: '#calculatordisplay'
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
            element: '#calculatordisplay'
          })

          continuation = function() {
            expect( incrementer ).to.equal( 1 )
            
            continuation = function() {
              expect( incrementer ).to.equal( 1 )
              done()
            }

            core.start('calculatordisplay', {
              element: '#calculatordisplay'
            })

            setTimeout(continuation, 120)

          }

        })

      })

      describe("core.stop", function() {

        beforeEach( reset )

        it("should unload the module definition and all definitions down the hierarchy of the moduleroot namespace", function( done ) {

          TESTDATA.calculatordisplay = {
            'onMain': function() {
              
              expect( require.defined(moduleRoot + 'calculatordisplay/main') ).to.equal( true )
              expect( require.defined(moduleRoot + 'calculatordisplay/models/Display') ).to.equal( true )
              expect( require.defined(moduleRoot + 'calculatordisplay/views/Display') ).to.equal( true )
              expect( require.defined('calculatordisplay/sandbox') ).to.equal( true )

              core.stop('calculatordisplay')

              setTimeout(function() {

                expect( require.defined(moduleRoot + 'calculatordisplay/main') ).to.equal( false )
                expect( require.defined(moduleRoot + 'calculatordisplay/models/Display') ).to.equal( false )
                expect( require.defined(moduleRoot + 'calculatordisplay/views/Display') ).to.equal( false )
                expect( require.defined('calculatordisplay/sandbox') ).to.equal( false )

                done()
              }, 200)

            }
          }

          core.start('calculatordisplay', {
            element: '#calculatordisplay'
          })

        })
        
        it("should run the destruct method of the module if the module has a destruct method", function( done ) {
          
          TESTDATA.destructable = {
            onDestruct: function() {

              done()
            }
          }

          core.start( "destructable" )

          setTimeout(function() {
            core.stop( "destructable" )
          }, 200)

        })

        it("should run the destruct method if the moduledefinition is a function and has a destruct property that is function", function( done ) {

          TESTDATA.destructablefunctionmodule = {
            onDestruct: function() {

              done()
            }
          }

          core.start( "destructablefunctionmodule" )

          setTimeout(function() {
            core.stop( "destructablefunctionmodule" )
          }, 200)

        })

        it("should not unload modules dependecies before destruct method calls its continuation callback", function( done ) {

          TESTDATA.destructablefunctionmodule = {
            onMain: function() {
              expect( require.defined(moduleRoot + 'destructablefunctionmodule/main') ).to.equal( true )
              expect( require.defined('destructablefunctionmodule/sandbox') ).to.equal( true )
              
              core.stop( "destructablefunctionmodule" )

              setTimeout(function() {

                expect( require.defined(moduleRoot + 'destructablefunctionmodule/main') ).to.equal( false )
                expect( require.defined('destructablefunctionmodule/sandbox') ).to.equal( false )

                done()
              }, 200)

            },
            onDestruct: function() {

              expect( require.defined(moduleRoot + 'destructablefunctionmodule/main') ).to.equal( true )
              expect( require.defined('destructablefunctionmodule/sandbox') ).to.equal( true )

            }
          }

          core.start( "destructablefunctionmodule" )

        })

        it("should cleanup the DOM element of the module by emptying it", function( done ) {

          TESTDATA.calculatordisplay = {
            'reportSandbox': function( sandbox ) {
              
              try {
                expect( $('#inside-calculatordisplay').length ).to.equal( 1 )
              } catch( e ) {
                done( e )
              }

              core.stop("calculatordisplay")

              setTimeout(function() {
                try {
                  expect( $('#inside-calculatordisplay').length ).to.equal( 0 )
                } catch( e ) {
                  done( e )
                }
                done()
              }, 100)

            }
          }

          core.start('calculatordisplay', {
            element: '#calculatordisplay'
          })

        })

      })

      describe("sandbox", function() {

        beforeEach( reset )

        it("should expose a shared sandbox object on namespace 'sandbox' to the module and all submodules", function( done ) {

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
            element: '#calculatordisplay'
          })

        })

        it("should create individual sandboxes for all 'sandbox' namespaces under each moduleroot namespace", function( done ) {

          var displaySB, inputSB

          function check( sandbox ) {
            if( !inputSB ) {
              inputSB = sandbox
            }
            else if( !displaySB ) {
              displaySB = sandbox
            }
            if( displaySB && inputSB ) {

              expect( displaySB !== inputSB ).to.equal( true )

              done()
            }
          }

          TESTDATA.calculatordisplay = {
            'reportSandbox': function( sandbox ) {
              check( sandbox )
            }
          }

          TESTDATA.calculatorinput = {
            'reportSandbox': function( sandbox ) {
              check( sandbox )
            }
          }

          core.start('calculatordisplay', {
            element: '#calculatordisplay'
          })

          core.start('calculatorinput', {
            element: '#calculatorinput'
          })

        })

        it("should have a property $ which acts as a jquery/zepto/ender or similar library proxy that sandboxes all selectors to the modules element", function( done ) {

          var displaySB, inputSB, nrOfReports

          nrOfReports = 0

          function check() {
            if(nrOfReports === 2) {
              if( displaySB && inputSB ) {

                expect( displaySB !== inputSB ).to.equal( true )
                expect( displaySB.$ && inputSB.$ ).to.be.ok()

                expect( displaySB.$('#inside-calculatordisplay').length ).to.equal( 1 )
                expect( inputSB.$('#inside-calculatorinput').length ).to.equal( 1 )

                expect( inputSB.$('#inside-calculatordisplay').length ).to.equal( 0 )
                expect( displaySB.$('#inside-calculatorinput').length ).to.equal( 0 )

                expect( inputSB.$('body').length ).to.equal( 0 )
                expect( displaySB.$('body').length ).to.equal( 0 )

                done()
              } else {
                done(new Error('Could not fetch sandboxes, something wrong with the tests'))
              }
            }
          }

          TESTDATA.calculatordisplay = {
            'reportSandbox': function( sandbox ) {
              displaySB = sandbox
              nrOfReports++
              check()
            }
          }

          TESTDATA.calculatorinput = {
            'reportSandbox': function( sandbox ) {
              inputSB = sandbox
              nrOfReports++
              check()
            }
          }

          core.start('calculatordisplay', {
            element: '#calculatordisplay'
          })

          core.start('calculatorinput', {
            element: '#calculatorinput'
          })

        })

        it("should not have access to the core itself through the sandbox", function( done ) {

          TESTDATA.calculatordisplay = {
            'reportSandbox': function( sandbox ) {
              
              var possibleCores = []

              possibleCores.push( sandbox.subscribe('accesstest', function() { return this }) )
              possibleCores.push( sandbox.publish('accesstest') )
              possibleCores.push( sandbox.subscribe('accesstest', function() {
                var self = this

                possibleCores.push( self )

                expect( possibleCores.length ).to.equal( 4 )

                _.forEach(possibleCores, function( possiblecore ) {
                  if( possiblecore === core ) {
                    done( new Error('the sandbox has access to core') )
                  }
                  if( possiblecore === core.api.public ) {
                    done( new Error('the sandbox has acces to core.api.public') )
                  }
                })

                done()
              }))
              possibleCores.push( sandbox.publish('accesstest') )
              
            }
          }

          core.start('calculatordisplay', {
            element: '#calculatordisplay'
          })

        })

      })

    })

  })

})