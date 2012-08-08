
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
    The configuration of the core.
    @public
    @type Object
  */
  core.configuration = {
    moduleRoot: '/'
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
  }

  /**
    @public
    @type Function
    @see core.subscribe
  */
  core.api.public.subscribe = function() {
    core.subscribe.apply( core, arguments )
    return core.api.public
  }

  /**
    @public
    @type Function
    @see core.resubscribe
  */
  core.api.public.resubscribe = function() {
    core.resubscribe.apply( core, arguments )
    return core.api.public
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
    Unbind the callback from firing when published to the given channel.
    @public
    @type Function
    @param {String} channel The name of the channel to unbind the callback from
    @param {Function} callback The callback to unbind
    @returns {cerebral/core} core
  */
  core.unsubscribe = function( channel, callback, listener ) {
    var subscriptions, index, subscription

    if( typeof channel !== 'string' ) {
      throw new TypeError( 'channel must be string' ) 
    }

    subscriptions = channels[ channel ]
    if( !subscriptions || !subscriptions.length ) {
      return null
    }

    for( index = 0; index < subscriptions.length; index++ ) {
      subscription = subscriptions[ index ] 
      
      if( typeof callback === 'function' && typeof listener !== 'undefined' ) {
        if( subscription.callback === callback && subscription.listener === listener ) {
          subscriptions.splice( index, 1 )  
        }
      } else if( callback && subscription.callback === callback ) {
        subscriptions.splice( index, 1 )
      } else if( listener && subscription.listener === listener ) {
        subscriptions.splice( index, 1 )
      }

    }

    if( subscriptions.length === 0 )
      delete channels[ channel ]

    return core
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

    return core
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

    define(
      module.sandboxPath,[
      ],
      sandbox
    )

    require([ module.mainPath ], 
      function( definition ) {
        var exception

        try {
          module.loadDefinition( definition )
        } catch( e ) {
          exception = e
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

      module.emptyElement()

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

        if( options.onDomReady ) {
          $(document).ready(function() {

            module.main()

          })
        } else {

          module.main()

        }

      } catch( e ) { 
        // TODO: logger
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