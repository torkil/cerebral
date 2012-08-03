define([
  'destructable/sandbox'
], 
function( sandbox, InputModel, InputView, ButtonView ) {
  
  function main() {

    if( TESTDATA.destructable.reportAlive ) {
      TESTDATA.destructable.reportAlive( true )
    }

  }

  function destruct( exit ) {

    if( TESTDATA.destructable.onDestruct ) {
      TESTDATA.destructable.onDestruct( true )
    }

    exit()
  }

  return { main: main, destruct: destruct }

})