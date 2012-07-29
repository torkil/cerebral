define([
  './models/Display',
  './views/Display'
], 
function( DisplayModel, DisplayView ) {
  return function( sandbox ) {
    
    if( TESTDATA.calculatordisplay.onMain )
      TESTDATA.calculatordisplay.onMain()

    if( TESTDATA.calculatordisplay.reportArguments ) {
      TESTDATA.calculatordisplay.reportArguments({
        sandbox: sandbox
      })
    }

    if( TESTDATA.calculatordisplay.domAccess ) {
      TESTDATA.calculatordisplay.domAccess( sandbox )
    }
      
  }
})