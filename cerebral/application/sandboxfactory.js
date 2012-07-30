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
    var sandbox, element, jquery

    sandbox = {}

    element = $( options.el )
    jquery = function( selector ) {
      return $( selector, $(options.el) )
    }
    
    sandbox.element = element
    sandbox.$ = jquery

    return sandbox
  }

  return {
    create: function( options ) {
      return createSandbox( options )
    }
  }
})