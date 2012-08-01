
/**
  Sandboxfactory. Responsible for creating new sanbox objects made available to application modules through the amd module loader.
  @exports sandboxfactory
  @requires [underscore, jquery]
*/
define(
"cerebral/application/sandboxfactory",[
  "underscore",
  "jquery"
], 
function( underscore, $ ){
  
  var sandboxfactory, properties


  sandboxfactory = {}

  properties = {
    $: function( selector ) {
      return $( selector, this.element )
    },
    element: '#sandbox'
  }

  sandboxfactory.defineProperty = function( name, value ) {
    if( typeof name !== 'string' ) {
      throw new TypeError( 'Name of property must be name' )
    }

    properties[ name ] = value
    return this
  }

  sandboxfactory.removeProperty = function( name ) {
    delete properties[ name ]
    return this
  }

  sandboxfactory.create = function( options ) {
    var sandbox, element

    sandbox = Object.create( properties )

    element = options.element
    if( element ) {
      sandbox.element = $( options.element )
    }

    return sandbox
  }

  return sandboxfactory
})