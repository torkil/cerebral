
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

  /**
    The object to be used as the prototype of created sansboxes
    @public
    @type Object
  */
  sandboxfactory.sandboxprototype = {
    /*
      Scoped DOM manipulation function, proxy for jquery/zepto/ender/etc.. Only has acces to elements within
      its own element
      @type Function
    */
    $: function( selector ) {
      return $( selector, this.element )
    },
    /*
      The element the sandbox has access to.
      @type Function|jQueryObject
      @default "#sandbox"
    */
    element: '#sandbox'
  }

  /**
    Delegate the core public api to the factory so we can facade core methods for publishing and subscribing as sandbox properties.
    @public
    @type Function
    @param {cerebral/application/core.api} coreapi The application core api
    @returns {cerebral/application/sandboxfactory} self
  */
  sandboxfactory.delegateCoreApi = function( coreapi ) {
    var attr
    if( typeof coreapi !== 'object' ) {
      throw new TypeError( 'No api delegated' )
    }

    for( attr in coreapi ) {
      sandboxfactory.sandboxprototype[ attr ] = coreapi[ attr ]
    }

    return this
  }

  /**
    Check if an object is a sandbox, checks if the prototype of the test is the same as sandbox.sandboxprototype
    @public
    @type Function
    @param {Mixed} test The object to check if is a sandbox
    @returns Boolean
  */
  sandboxfactory.isSandbox = function( test ) {
    if( Object.getPrototypeOf( test ) === sandboxfactory.sandboxprototype ) {
      return true
    }
    else {
      return false
    }
  }

  /**
    Create a new sandbox object with the properties on the properties object attached to its prototype
    @public
    @type Function
    @param {cerebral/application/core} core The application core
    @param {Options} options The options for the sandbox
    @param options.element The DOM element the sandbox has access to
    @returns {Object} sandbox
  */
  sandboxfactory.create = function( attributes ) {
    var sandbox

    sandbox = Object.create( sandboxfactory.sandboxprototype )
    sandbox = _.extend( sandbox, attributes )

    if( sandbox.element )
      sandbox.element = $( sandbox.element )

    return sandbox
  }

  return sandboxfactory
})