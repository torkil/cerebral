/*
  Sandboxfactory
*/
define(
"cerebral/application/sandboxfactory",[
  "underscore",
  "jquery"
], 
function( underscore, $ ){
  
  function createSandbox( options ) {
    var sandbox, element, DOMlib

    sandbox = {}

    element = $( options.el )
    DOMlib = function( selector ) {
      return $( selector, element )
    }
    
    sandbox.element = element
    sandbox.$ = DOMlib

    return sandbox
  }

  return {
    create: function( options ) {
      return createSandbox( options )
    }
  }
})