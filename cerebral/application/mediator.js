define(
"cerebral/application/mediator",[ 
], 
function( ){
  
  var mediator, channels, interfaces

  mediator = {}

  /**
    Holds the callback listeners bound to fire when published to that specific channel.
    @private
    @type Object
  */
  channels = {}

  /**
    Get the the channels. Meant for testing and debugging only.
    @public
    @type Function
    @returns {Object} channels
  */
  mediator.__getChannels = function() {
    return channels
  }

  /**
    Holds the interfaces
    @private
    @type Object
  */
  interfaces = {}

  /**
    Get the the interfaces. Meant for testing and debugging only.
    @public
    @type Function
    @returns {Object} channels
  */
  mediator.__getInterfaces = function() {
    return interfaces
  }

  /**
    The configuration of the mediator.
    @public
    @type Object
  */
  mediator.configuration = {
    moduleRoot: '/',
    namespaceDelimiter: "::"
  }

  /**
    Binds a callback to be called when published to the channel given.
    @public
    @type Function
    @param {String} channel The name of the channel to bind the callback to
    @param {Function} callback The callback to fire
    @param {Object} context The context of the callback. The callback will have this paramter as its this value
  */
  mediator.subscribe = function( channel, callback, context, listener ) {
    if( typeof channel !== 'string' ) {
      throw new TypeError( 'channel must be string' ) 
    }
    if( typeof callback !== 'function' ) {
      throw new TypeError( 'callback must be function' ) 
    }

    if( !channels[channel] ) {
      channels[ channel ] = [] 
    }

    context = context || {}
    listener = listener || null

    channels[ channel ].push({
      callback: callback,
      context: context,
      listener: listener
    })

  }

  /**
    Removes a callback where the given arguments mathes the listener properties
    @public
    @type Function
    @param {String} channel The name of the channel to bind the callback to
    @param {Function} callback The callback to fire
    @param {Object} listener The listener, should be a Module.
  */
  function removeSubscriptionsByChannel( channel, callback, listener ){
    var subscriptions, subscribingChannel, index, subscription

    for( subscribingChannel in channels ) {
      if( mediator.namespaceMatch(subscribingChannel, channel) ) {
        subscriptions = channels[ subscribingChannel ]

        for( index = 0; index < subscriptions.length; index = index+1 ) {

          subscription = subscriptions[ index ]
          
          if( typeof callback === 'function' && typeof listener !== 'undefined' ) {
            if( subscription.callback === callback && subscription.listener === listener ) {
              subscriptions.splice( index, 1 )
              index = index - 1
            }
          } else if( callback ) {
            if( subscription.callback === callback ) {
              subscriptions.splice( index, 1 )
              index = index - 1
            }
          } else if( listener ) {
            if( subscription.listener === listener ) {
              subscriptions.splice( index, 1 )
              index = index - 1
            }
          } else {
            subscriptions.splice( 0 )
            index = index - 1
          }

        }
        
        if( subscriptions.length === 0 ) {
          delete channels[ subscribingChannel ]
        }

      }
    }
  }

  /**
    Removes all callbacks for a given listener
    @public
    @type Function
    @param {String} channel The name of the channel to bind the callback to
    @param {Function} callback The callback to fire
    @param {Object} listener The listener, should be a Module.
  */
  function removeSubscriptionsByListener( listener ){
    var subscriptions, subscribingChannel, index, subscription

    for( subscribingChannel in channels ) { 
      subscriptions = channels[ subscribingChannel ]

      for( index = 0; index < subscriptions.length; index = index+1 ) {
        subscription = subscriptions[ index ]
        if( subscription.listener === listener ) {
          subscriptions.splice( index, 1 )
          index = index - 1
        }
      }

      if( subscriptions.length === 0 ) {
        delete channels[ subscribingChannel ]
      }
    }

  }

  /**
    Unbind the callback from firing when published to the given channel.
    @public
    @type Function
    @param {String} channel The name of the channel to unbind the callback from
    @param {Function} callback The callback to unbind
    @returns {Boolean}
  */
  mediator.unsubscribe = function( channel, callback, listener ) {

    if( channel ) {
      return removeSubscriptionsByChannel( channel, callback, listener )
    } else if( listener ) {
      return removeSubscriptionsByListener( listener )
    }

    return false
  }

  /**
    Publish to a channel, passing the arguments after channel to the callback.
    @public
    @type Function
    @param {String} channel The name of the channel to unbind the callback from
    @param {Mixed[]} args The arguments after channel to be passed to callback
    @returns {Boolean}
  */
  mediator.publish = function( channel ) {
    var subscriptions, args, subscribingChannel, i, subscription

    subscriptions = []
    args = [].slice.call(arguments, 1)

    for( subscribingChannel in channels ) {
      if( mediator.namespaceMatch(channel, subscribingChannel) ) {
        if( channels[channel] ) {
          subscriptions = subscriptions.concat( channels[subscribingChannel] )
        }
      }
    }

    if( !subscriptions.length ) return false

    for( i = 0; i < subscriptions.length; i = i+1 ) {
      subscription = subscriptions[i]
      subscription.callback.apply( subscription.context, args )
    }

    return true
  }

  /**
    Check if a channel name is within the bound of another channel namespace.
    @public
    @type Function
    @param {String} requested The name of the channel published to
    @param {String} nameSpace The name of the subscribing channel to test against
    @returns Boolean
  */
  mediator.namespaceMatch = function( requested, nameSpace ) {
    var matches, publishNamespace, subscriptionNamespace, i

    matches = true
    publishNamespace = requested.split( mediator.configuration.namespaceDelimiter )
    subscriptionNamespace = nameSpace.split( mediator.configuration.namespaceDelimiter )

    for( i = 0; i < subscriptionNamespace.length; i = i+1 ) {
      if( publishNamespace[i] !== subscriptionNamespace[i] ) {
        matches = false
        break;
      }
    }

    return matches
  }

  function getInterfaceByNameSpace( nameSpace ) {
    if( interfaces.hasOwnProperty(nameSpace) ) {
      return interfaces[ nameSpace ]
    }
    return null
  }

  mediator.registerInterface = function( nameSpace, interface ) {
    if( typeof nameSpace !== 'string' ) {
      throw new TypeError( "expected type String, got " + typeof nameSpace )
    }
    if( typeof interface === undefined ) {
      throw new TypeError( "interface cannot be undefined" )
    }

    interfaces[ nameSpace ] = interface
  }

  mediator.dropInterface = function( nameSpace ) {
    delete interfaces[ namespace ]
  }

  mediator.requestInterface = function( nameSpace, callback ) {
    var interface, error

    interface = getInterfaceByNameSpace( nameSpace )
    error = null

    if( !interface ) {

      error = new Error( 'interface; ' + nameSpace + '  -> was not found' )
      error.code = 400

    }

    if( typeof callback === 'function' ) {
      return callback( error, interface)
    } else if( error ) {
      return error
    }

    return interface
  }


  return mediator
})