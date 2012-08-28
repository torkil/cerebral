define(
"cerebral/application/sandbox/prototype", [
], 
function(){
  
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


  return sandboxprototype
})