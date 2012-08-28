define(
"cerebral/application/sandbox/prototype", [
  "cerebral/application/classes/Interface"
], 
function( Interface ){
  
  var sandboxprototype

  sandboxprototype = {}

  /*
    The element the sandbox has access to.
    @type Function|jQueryObject
    @default "#sandbox"
  */
  sandboxprototype.element = '#sandbox'

  /*
    Scoped DOM manipulation function, proxy for jquery/zepto/ender/etc.. Only has acces to elements within
    its own element
    @type Function
  */
  sandboxprototype.$ = function( selector ) {
    return $( selector, this.element )
  }

  function generateInterfaceNamespace( name ) {
    return name
  }

  sandboxprototype.defineInterface = function( nameSpace, definition ) {
    var interface

    if( !this.namespaceMatch(nameSpace, this.module.name) ) {
      throw new Error( "cannot define interface not within namespace of " + this.module.name + "::*" )
    }

    if( interface instanceof Interface ) {
      interface = definition
    } else {
      interface = new Interface( definition )
    }
    
    return interface.subscribe( nameSpace )
  }

  sandboxprototype.requestInterface = function( nameSpace, callback ) {
    var error

    if( !this.publish( nameSpace, callback ) ) {

      error = new Error( 'interface: ' + nameSpace + '  -> was not found' )
      error.code = 400

      callback( error )
      return false
    }

    return true
  }


  return sandboxprototype
})