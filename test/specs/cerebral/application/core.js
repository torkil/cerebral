
require([
  "cerebral/application/core",
  "cerebral/application/sandbox/factory"
], 
function( core, sandboxfactory ) {
  
  var moduleRoot = 'test/specs/cerebral/application/testmodules/'

  core.configure({
    moduleRoot: moduleRoot
  })

  function reset() {
    $('#app_test').html( $('#app_test_template').html() )
    core.stop('calculatordisplay')
    core.stop('calculatorinput')
    core.stop('faultyreturn')
    core.stop('mainreporter')
  }
  
  describe("cerebral/application/core", function() {
    
    describe("modules", function() {

      beforeEach( reset )

      describe("core.loadModule", function() {

        beforeEach( reset )

        it("should use amd loading to load a module from the desired namespace", function( done ) {

          core.loadModule({
            name: 'mainreporter'
          }, 
          function( err, mainreporter ) {

            expect( mainreporter.main() ).to.be.ok()

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

          var incrementer

          incrementer = 0

          TESTDATA.calculatordisplay = {
            'onMain': function() {
              incrementer++
            }
          }

          setTimeout(function() {

            try {
              expect( incrementer ).to.equal( 1 )
            } catch( e ) {
              done( e )
            }

            done()
          },100)

          core.start('calculatordisplay', {
            element: '#calculatordisplay'
          })
          core.start('calculatordisplay', {
            element: '#calculatordisplay'
          })
          core.start('calculatordisplay', {
            element: '#calculatordisplay'
          })

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
                expect( sandbox.$('#inside-calculatordisplay').length ).to.equal( 1 )
              } catch( e ) {
                done( e )
              }

              core.stop("calculatordisplay")

              setTimeout(function() {
                try {
                  expect( sandbox.$('#inside-calculatordisplay').length ).to.equal( 0 )
                } catch( e ) {
                  done( e )
                }
                done()
              }, 100)

            }
          }

          core.start('calculatordisplay', {
            sandbox: {
              element: '#calculatordisplay'
            }
          })

        })

      })
      
      describe("context", function() {

        it("should call the methods of the module with the module as context so the module can refer to itself as this within its methods", function( done ) {

          var mainthis, destructthis

          core.start('context', {
            sandbox: {
              mainThis: function( module ) {

                mainthis = module
                core.stop('context')

              },
              destructThis: function( module ) {
                destructthis = module

                try {

                  expect( mainthis === destructthis ).to.equal( true )
                  expect( mainthis.prop ).to.equal( 'prop' )
                  expect( mainthis.foo ).to.equal( 'bar' )
                  expect( mainthis.mainset ).to.equal( 'mainset' )
                  expect( destructthis.prop ).to.equal( 'prop' )
                  expect( destructthis.destructset ).to.equal( 'destructset' )

                } catch( e ) {
                  done( e )
                }

                done()
              }
            }
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
            sandbox: {
              element: '#calculatordisplay'
            }
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
            sandbox: {
              element: '#calculatordisplay'
            }
          })

          core.start('calculatorinput', {
            sandbox: {
              element: '#calculatorinput'
            }
          })

        })

        it("should have a property $ which acts as a jquery/zepto/ender or similar library proxy that sandboxes all selectors to the modules element", function( done ) {

          var displaySB, inputSB, nrOfReports

          nrOfReports = 0

          function check() {

            if(nrOfReports === 2) {
              if( displaySB && inputSB ) {

                try {
                  expect( displaySB !== inputSB ).to.equal( true )
                  expect( displaySB.$ && inputSB.$ ).to.be.ok()
                  
                  expect( displaySB.$('#inside-calculatordisplay').length ).to.equal( 1 )
                  expect( inputSB.$('#inside-calculatorinput').length ).to.equal( 1 )

                  expect( inputSB.$('#inside-calculatordisplay').length ).to.equal( 0 )
                  expect( displaySB.$('#inside-calculatorinput').length ).to.equal( 0 )

                  expect( inputSB.$('body').length ).to.equal( 0 )
                  expect( displaySB.$('body').length ).to.equal( 0 )
                } catch( e ) {
                  done( e )
                }

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
            sandbox: {
              element: '#calculatordisplay'
            }
          })

          core.start('calculatorinput', {
            sandbox: {
              element: '#calculatorinput'
            }
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

                _.forEach(possibleCores, function( possiblecore, index ) {
                  if( possiblecore === core ) {
                    done( new Error('the sandbox has access to core') )
                  }
                })

                done()
              }))
              possibleCores.push( sandbox.publish('accesstest') )
              
            }
          }

          sandboxfactory.permissions.extend({
            'calculatordisplay': {
              'accesstest': true
            }
          })

          core.start('calculatordisplay', {
            sandbox: {
              element: '#calculatordisplay'
            }
          })

        })


        it("should not have access to other modules individual sandbox properties", function( done ) {

          var displaySB, inputSB

          TESTDATA.calculatordisplay = {
            'reportSandbox': function( sandbox ) {
              displaySB = sandbox
              check()
            }
          }

          TESTDATA.calculatorinput = {
            'reportSandbox': function( sandbox ) {
              inputSB = sandbox
              check()
            }
          }

          function check() {
            if( displaySB && inputSB ) {
              
              try {

                expect( displaySB.num ).to.equal( 1 )
                expect( inputSB.num ).to.equal( 2 )

                expect( displaySB.displaySpecific() ).to.equal( 'display' )
                expect( displaySB.inputspecific ).to.equal( undefined )

                expect( inputSB.inputspecific() ).to.equal( 'input' )
                expect( inputSB.displaySpecific ).to.equal( undefined )

              } catch( e ) {
                done( e )
              }

              done()
            }
          }

          core.start('calculatordisplay', {
            sandbox: {
              element: '#calculatordisplay',
              num: 1,
              displaySpecific: function() {
                return 'display'
              }
            }
          })

          core.start('calculatorinput', {
            sandbox: {
              element: '#calculatorinput',
              num: 2,
              inputspecific: function() {
                return 'input'
              }
            }
          })

        })

        it("should take a created sandbox straight from sandboxfactory.create as parameter", function( done ) {

          TESTDATA.calculatordisplay = {
            'reportSandbox': function( sandbox ) {
              
              try {
                expect( sandbox.report() ).to.equal( 'report' )
              } catch( e ) {
                done( e )
              }

              done()
            }
          }

          core.start('calculatordisplay', {
            sandbox: sandboxfactory.create({
              element: '#calculatordisplay',
              report: function() {
                return 'report'
              }
            })
          })

        })

        it("should be able to share sandbox if it is created be sandboxfactory beforehand", function( done ) {

          var displaySB, inputSB, sharedSB

          TESTDATA.calculatordisplay = {
            'reportSandbox': function( sandbox ) {
              displaySB = sandbox
              check()
            }
          }

          TESTDATA.calculatorinput = {
            'reportSandbox': function( sandbox ) {
              inputSB = sandbox
              check()
            }
          }

          function check() {
            if( displaySB && inputSB ) {
              
              try {
                
                expect( displaySB === sharedSB ).to.equal( true )
                expect( inputSB === sharedSB ).to.equal( true )

                expect( displaySB.sharedMethod() + inputSB.sharedMethod() ).to.equal( "sharedshared" )

              } catch( e ) {
                done( e )
              }

              done()
            }
          }

          sharedSB = sandboxfactory.create({
            sharedMethod: function() {
              return 'shared'
            }
          })

          core.start('calculatordisplay', {
            sandbox: sharedSB
          })

          core.start('calculatorinput', {
            sandbox: sharedSB
          })

        })

      })

    })

  })

})