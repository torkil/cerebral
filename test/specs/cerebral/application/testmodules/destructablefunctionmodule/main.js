
define([
  'destructablefunctionmodule/sandbox'
], 
function( sandbox, InputModel, InputView, ButtonView ) {
  
  function main() {
    if( TESTDATA.destructablefunctionmodule.onMain ) {
      TESTDATA.destructablefunctionmodule.onMain( true )
    }

  }

  main.destruct = function( exit ) {

    if( TESTDATA.destructablefunctionmodule.onDestruct ) {
      TESTDATA.destructablefunctionmodule.onDestruct( true )
    }

    exit()
  }

  return main

})