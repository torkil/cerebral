define([
  'calculatorinput/sandbox',
  './models/Input',
  './views/Input',
  './views/Button'
], 
function( sandbox, InputModel, InputView, ButtonView ) {
  
  return function main() {

    if( TESTDATA.calculatorinput.reportSandbox ) {
      TESTDATA.calculatorinput.reportSandbox( sandbox )
    }

  }

})