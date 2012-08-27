
/**
  The core module, responsible for mediating between modules using the publish-subscribe pattern.
  This should not be directly exposed to the submodules of the application, rather expose methods like publish and
  subscribe through a facade. Google facade pattern.
  @exports core
  @requires [underscore]
*/
define(
"cerebral/application/core",[
  "underscore",
  "jquery",
  "cerebral/application/Module",
  "cerebral/application/sandboxfactory"
], 
function( _, $, Module, sandboxfactory ){
  
  var core, channels, modules, startDefaultOptions

  core = {
    /*
      The api object of the core. Used for describing what could be exposed through facades and delegation. 
      Only an abstraction and holds no real protection value.
      @type Object
    */
    api: {
      /*
        Public api for all modules to use.
        @type Object
      */
      public: {}
    }
  }

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
  core.__getChannels = function() {
    return channels
  }

  /**
    Holds all loaded modules
    @private
    @type Object
  */
  modules = {}

  /**
    Get the the modules. Meant for testing and debugging only.
    @public
    @type Function
    @returns {Object} channels
  */
  core.__getModules = function() {
    return modules
  }

  /**
    The configuration of the core.
    @public
    @type Object
  */
  core.configuration = {
    moduleRoot: '/',
    namespaceDelimiter: "::"
  }

  /**
    Configure the core,
    @public
    @type Function
    @param {Object} configuration The configuration object to extend the cores configuration with
    @returns {cerebral/core} core
  */
  core.configure = function( configuration ) {
    _.extend( this.configuration, configuration )
    return core
  }
  
  /**
    @public
    @type Function
    @see core.publish
  */
  core.api.public.publish = function() {
    core.publish.apply( core, arguments )
    return core.api.public
    return core.publish.apply( core, arguments )
  }

  /**
    @public
    @type Function
    @see core.subscribe
  */
  core.api.public.subscribe = function() {
    core.subscribe.apply( core, arguments )
    return core.api.public
    return core.subscribe.apply( core, arguments )
  }

  /**
    @public
    @type Function
    @see core.unsubscribe
  */
  core.api.public.unsubscribe = function() {
    core.unsubscribe.apply( core, arguments )
    return core.api.public
  }

  /**
    @public
    @type Function
    @see core.namespaceMatch
  */
  core.api.public.namespaceMatch = function() {
    return core.namespaceMatch.apply( core, arguments )
  }

  /**
    Binds a callback to be called when published to the channel given.
    @public
    @type Function
    @param {String} channel The name of the channel to bind the callback to
    @param {Function} callback The callback to fire
    @param {Object} context The context of the callback. The callback will have this paramter as its this value
    @returns {cerebral/core} core
  */
  core.subscribe = function( channel, callback, context, listener ) {
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

    return core
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
      if( core.namespaceMatch(subscribingChannel, channel) ) {
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
    @returns {cerebral/core} core
  */
  core.unsubscribe = function( channel, callback, listener ) {

    if( channel ) {
      return removeSubscriptionsByChannel( channel, callback, listener )
    } else if( listener ) {
      return removeSubscriptionsByListener( listener )
    }

    return core
    return false
  }

  /**
    Publish to a channel, passing the arguments after channel to the callback.
    @public
    @type Function
    @param {String} channel The name of the channel to unbind the callback from
    @param {Mixed[]} args The arguments after channel to be passed to callback
    @returns {cerebral/core} core
  */
  core.publish = function( channel ) {
    var subscriptions, args, subscribingChannel, i, subscription

    subscriptions = []
    args = [].slice.call(arguments, 1)

    for( subscribingChannel in channels ) {
      if( core.namespaceMatch(channel, subscribingChannel) ) {
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
    @param {String} publishedChannel The name of the channel published to
    @param {String} subscribingChannel The name of the subscribing channel to test against
    @returns Boolean
  */
  core.namespaceMatch = function( publishedChannel, subscribingChannel ) {
    var matches, publishNamespace, subscriptionNamespace, i

    matches = true
    publishNamespace = publishedChannel.split( core.configuration.namespaceDelimiter )
    subscriptionNamespace = subscribingChannel.split( core.configuration.namespaceDelimiter )

    for( i = 0; i < subscriptionNamespace.length; i = i+1 ) {
      if( publishNamespace[i] !== subscriptionNamespace[i] ) {
        matches = false
        break;
      }
    }

    return matches
  }

  /**
    Check if a module is loaded and started
    @public
    @type Function
    @param {String} modulename The name of the namespace/folder that contains the module
    @returns Boolean
  */
  core.modulesIsLoaded = function( modulename ) {
    return ( modulename in modules )
  }
  
  /**
    Require a module from the moduleRoot namespace, will automagicaly look for the main.js within the modulename folder.
    @public
    @type Function
    @param {String} modulename The name of the namespace/folder that contains the module
    @param {Function} callback The continuation to call when either an error os produced or the module is found.
    @returns {cerebral/core} core
  */
  core.loadModule = function( options, callback ) {
    var module, sandboxAttributes, sandbox
    if( core.modulesIsLoaded(options.name) ) {

      module = modules[ options.name ]
      return callback( null, module )

    }

    module = new Module({
      root: this.configuration.moduleRoot,
      name: options.name
    })

    modules[ module.name ] = module
    
    if( options.sandbox ) {
      if( sandboxfactory.isSandbox(options.sandbox) ) {
        sandbox = options.sandbox
      } else {
        sandbox = sandboxfactory.create( options.sandbox )
      }
    } else {
      sandbox = sandboxfactory.create({ })
    }

    module.element = sandbox.element
    sandbox.module = module

    define(
      module.sandboxPath,[
      ],
      sandbox
    )

    require([ module.mainPath ], 
      function( definition ) {

        try {
          module.loadDefinition( definition )
        } catch( exception ) {
          return callback( exception )
        }

        callback( null, module )  
        
      },
      function( error ) {
        
        core.unloadModule( module.name )
        callback( error )
        
      })
    return core
  }

  /**
    Unload a module, undefining it in the amd loader and propegating down to all dependecies within the same module namespace.
    @public
    @type Function
    @param {String} modulename The name of the namespace/folder that contains the module
    @returns {cerebral/core} core
  */
  core.unloadModule = function( modulename ) {
    var definedModules, name, module
    
    definedModules = require.s.contexts._.defined

    module = modules[ modulename ]

    if( module ) {

      if( require.defined(module.sandboxPath) ) {
        require.undef( module.sandboxPath )
      }

      for( name in definedModules ) {
        if( definedModules.hasOwnProperty(name) && name.indexOf(module.name) !== -1 ) {

          require.undef( name )

        }
      }  

      module.cleanupDOM()

      delete modules[ modulename ]
    }
    
    return core
  }

  /**
    Default options for core.start
    @private
    @type Object
  */
  startDefaultOptions = {
    onDomReady: true
  }

  /**
    Load and start a module by running the returned main function with a new sandbox object.
    @public
    @type Function
    @param {String} modulename The name of the namespace/folder that contains the module
    @param {Object} options Options for the module and sandbox
    @param options.onDomReady If the module should wait for DOM to be ready before executing the modules main function
    @param options.sandbox The sandbox or an object of attrubutes to set on the sandbox for the module to start
    @param. options.sandbox.element The element to restrict dom access to
    @returns {cerebral/core} core
  */
  core.start = function( modulename, options ) {
    if( core.modulesIsLoaded(modulename) ) {
      return core
    }
      
    options = _.extend( startDefaultOptions, options )

    core.loadModule({
      name: modulename,
      sandbox: options.sandbox
    }, 
    function( err, module ) {

      if( err ) {
        throw err
      }

      try {

        module.running = true

        if( options.onDomReady ) {
          $( document ).ready(function() {
            module.main()
          })
        } else {
          module.main()
        }

      } catch( e ) { 
        console.log( "module: " + modulename + " main method threw expection: " )
        module.running = false
        throw e
      }
    })  
  
    return core
  }

  /**
    Stops a running module.
    @public
    @type Function
    @param {String} modulename The name of the namespace/folder that contains the module
    @returns {cerebral/core} core
  */
  core.stop = function( modulename ) {
    var module

    if( !core.modulesIsLoaded(modulename) )
      return core

    module = modules[ modulename ]
    
    module.destruct(function() {
      module.running = false
      core.unloadModule( modulename )
    })

    return core
  }

  /**
    Delegate the core.api.public to the sandboxprototype
    @augments sandboxfactory.sandboxprototype
  */
  sandboxfactory.delegateCoreApi( core.api.public )

  return core
})