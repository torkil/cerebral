
/**
  The core module, responsible for mediating between modules using the publish-subscribe pattern
  @exports cerebral/core
  @requires [underscore]
*/
define(
"cerebral/application/core",[
  "underscore"
], 
function( _ ){
  
  var core, channels

  core = {
    moduleRoot: '/'
  }

  /**
    Holds the callback listeners bound to fire when published to that specific channel 
    @private
    @type Object
  */
  channels = {}

  core.configuration = {}

  core.configure = function( configuration ) {
    _.extend( this.configuration, configuration )
  }
  
  /**
    Binds a callback to be called when published to the channel given
    @public
    @type Function
    @param {String} channel The name of the channel to bind the callback to
    @param {Function} callback The callback to fire
    @param {Object} context The context of the callback. The callback will have this paramter as its this value
    @returns {cerebral/core} self
  */
  core.subscribe = function( channel, callback, context ) {
    if( typeof channel !== 'string' ) {
      throw new TypeError( 'channel must be string' ) 
    }
    if( typeof callback !== 'function' ) {
      throw new TypeError( 'callback must be function' ) 
    }
    if( !channels[channel] ) {
      channels[ channel ] = [] 
    }
    channels[ channel ].push({
      callback: callback,
      context: context || {}
    })
    return this
  }

  /**
    Unbind the callback from firing when published to the given channel
    @public
    @type Function
    @param {String} channel The name of the channel to unbind the callback from
    @param {Function} callback The callback to unbind
    @returns {cerebral/core} self
  */
  core.unsubscribe = function( channel, callback ) {
    var listeners, index, listener
    if( typeof channel !== 'string' ) {
      throw new TypeError( 'channel must be string' ) 
    }
    listeners = channels[ channel ]
    if( !listeners || !listeners.length ) {
      return null
    }
    for( index = 0; index < listeners.length; index++ ) {
      listener = listeners[ index ] 
      if( listener.callback === callback ) {
        listeners.splice( index, 1 )
      }
    }
    return this
  }

  /**
    Publish to a channel, passing the arguments after channel to the callback
    @public
    @type Function
    @param {String} channel The name of the channel to unbind the callback from
    @param {Mixed[]} args The arguments after channel to be passed to callback
    @returns {cerebral/core} self
  */
  core.publish = function( channel ) {
    var listeners, args, index, listener
    listeners = channels[ channel ]
    if( !listeners || !listeners.length ) {
      return null
    }
    args = [].splice.call( arguments, 1 )
    for( index = 0; index < listeners.length; index++ ) {
      listener = listeners[ index ] 
      listener.callback.apply( listener.context, args )
    }
    return this
  }

  core.loadModule = function( modulename, callback ) {
    var moduleRoot, mainPath
    moduleRoot = this.configuration.moduleRoot + modulename
    mainPath = moduleRoot + '/main' 
    require([ mainPath ], 
      function( module ) {
        if( typeof module !== 'function' ) {
          core.unloadModule( modulename )
          callback( TypeError('Module returned value not of type function') )
        } else {
          callback( null, module )
        }
      },
      function( error ) {
        core.unloadModule( modulename )
        callback( error )
      })
  }

  core.unloadModule = function( modulename ) {
    var definedModules, name
    definedModules = require.s.contexts._.defined
    for( name in definedModules ) {
      if( definedModules.hasOwnProperty(name) && name.indexOf(modulename) !== -1 ) {
        require.undef( name )
      }
    }
  }
  
  return core
})