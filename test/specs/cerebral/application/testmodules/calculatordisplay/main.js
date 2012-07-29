define([
  'sandbox',
  './models/Display',
  './views/Display'
], 
function( sandbox, DisplayModel, DisplayView ) {

  return function main( ) {
    
    if( TESTDATA.calculatordisplay.onMain ) {
      TESTDATA.calculatordisplay.onMain()
    }

    if( TESTDATA.calculatordisplay.compareSandboxes ) {
      var model = new DisplayModel()
      TESTDATA.calculatordisplay.compareSandboxes({
        mainSandbox: sandbox,
        subSandbox: model.getSandbox()
      })
    }

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