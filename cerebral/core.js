define("cerebral/core",[
  "underscore"
], 
function( _ ){
  
  var channels, core

  channels = {}

  core = {
    
    subscribe: function( channel, callback, context ) {
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
    },

    unsubscribe: function( channel, callback ) {
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
    },

    publish: function( channel ) {
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
    }

  }
  
  return core
})