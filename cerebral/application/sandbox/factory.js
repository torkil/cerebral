
/**
  Sandboxfactory. Responsible for creating new sanbox objects made available to application modules through the amd module loader.
  @exports sandboxfactory
  @requires [underscore, jquery]
*/
define(
"cerebral/application/sandbox/factory", [
  "underscore",
  "jquery",
  "cerebral/application/sandbox/prototype",
  "cerebral/application/mediator"
], 
function( underscore, $, sandboxprototype, mediator ){
  
  var sandboxfactory  

  sandboxfactory = {}

  /**
    The object to be used as the prototype of created sandboxes
    @public
    @type Object
  */
  sandboxfactory.sandboxprototype = sandboxprototype

  sandboxfactory.permissions = {
    perms: {}
  }

  sandboxfactory.permissions.extend = function( attrs ) {
    _.extend( this.perms, attrs )
    return this
  }
  
  sandboxfactory.sandboxprototype.validatePermission = function( module, channel ) {
    var permissions, permission

    if( mediator.namespaceMatch(channel, module.name )) {
      return true
    }

    permissions = sandboxfactory.permissions.perms[ module.name ] 

    if( !permissions ) {
      console.error( 'module ' + module.name + ' was denied access to channel ' + channel )
      return false
    }
    for( permission in permissions ) {
      if( mediator.namespaceMatch(channel, permission) ) {
        return permissions[ permission ]
      }
    }

    console.error( 'module ' + module.name + ' was denied access to channel ' + channel )
    return false
  }

  sandboxfactory.sandboxprototype.subscribe = function( channel, callback, context ) {
    if( this.validatePermission(this.module, channel) ) {
      return mediator.subscribe( channel, callback, context, this.module )
    }
  }

  sandboxfactory.sandboxprototype.unsubscribe = function( channel, callback ) {
    return mediator.unsubscribe( channel, callback, this.module )
  }

  sandboxfactory.sandboxprototype.publish = function( channel ) {
    if( this.validatePermission(this.module, channel) ) {
      return mediator.publish.apply( mediator, arguments )
    }
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
    } else if( test.__cerebralsandbox__ ) {
      return true
    } else {
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
    sandbox.__cerebralsandbox__ = true

    if( sandbox.element )
      sandbox.element = $( sandbox.element )

    return sandbox
  }

  return sandboxfactory
})