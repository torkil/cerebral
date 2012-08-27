define(
"cerebral/application/sandboxprototype", [
], 
function(){
  
  var sandboxprototype = {}

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

  function createNamespaceForService( servicename ) {
    return 'services::' + servicename
  }

  sandboxprototype.registerService = function( name, fn ) {
    this.subscribe( createNamespaceForService(name), function( serviceHandler ) {
      serviceHandler( null, fn )
    }, this)
  }

  sandboxprototype.requestService = function( name, serviceHandler ) {
    var serviceExists

    serviceExists = this.publish( createNamespaceForService(name), serviceHandler )

    if(! serviceExists ) {

      serviceHandler({
        code: 400,
        message: 'not found'        
      })

    }
  }

  return sandboxprototype
})