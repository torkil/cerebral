
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
    The properties to attach to the created sandbox objects prototype.
    @private
    @type Object
  */
  properties = {
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
    Set a property in the properties object.
    @public
    @type Function
    @param {String} name The name of the property
    @param {Mixed} value The value of the property
    @returns {cerebral/application/sandboxfactory} self
  */
  sandboxfactory.defineProperty = function( name, value ) {
    if( typeof name !== 'string' ) {
      throw new TypeError( 'Name of property must be name' )
    }

    properties[ name ] = value
    return this
  }

  /**
    Delete a property from the properties object.
    @public
    @type Function
    @param {String} name The name of the property to remove
    @returns {cerebral/application/sandboxfactory} self
  */
  sandboxfactory.removeProperty = function( name ) {
    delete properties[ name ]
    return this
  }

  /**
    Delegate the core public api to the factory so we can facade core methods for publishing and subscribing as sandbox properties.
    @public
    @type Function
    @param {cerebral/application/core.api} coreapi The application core api
    @returns {cerebral/application/sandboxfactory} self
  */
  sandboxfactory.delegateCoreApi = function( coreapi ) {
    if( typeof coreapi !== 'object' ) {
      throw new TypeError( 'No api delegated' )
    }

    _.forEach(coreapi, function( propertyvalue, propertyname ) {
      
      sandboxfactory.defineProperty(propertyname, function() {
        coreapi[ propertyname ].apply( {}, arguments )
      })
    })

    return this
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
  sandboxfactory.create = function(options ) {
    var proto, sandbox, element

    proto = _.clone( properties )

    sandbox = Object.create( proto )

    element = options.element
    if( element ) {
      sandbox.element = $( options.element )
    }

    return sandbox
  }

  return sandboxfactory
})