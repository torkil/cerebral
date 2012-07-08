
/**
  The core module, responsible for mediating between modules using the publish-subscribe pattern
  @exports cerebral/core
  @requires [underscore]
*/
define("cerebral/core",[
  "underscore"
], 
function( _ ){
  
  var channels, core

  /**
    Holds the callback listeners bound to fire when published to that specific channel 
    @private
    @type Object
  */
  channels = {}

  core = {}
  
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
    if( !listeners ) {
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

  
  return Object.create( core )
})