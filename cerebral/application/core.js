
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
  "cerebral/application/sandboxfactory"
], 
function( _, sandboxfactory ){
  
  var core, channels

  core = {
    /*
      The api object of the core. Used for describing what could be exposed through facades and delegation. 
      Only and abstraction and holds no real protection value.
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
    Require a module from the moduleRoot namespace, will automagicaly look for the main.js within the modulename folder.
    @public
    @type Function
    @param {String} modulename The name of the namespace/folder that contains the module
    @param {Function} callback The continuation to call when either an error os produced or the module is found.
    @returns {cerebral/core} core
  */
  core.loadModule = function( options, callback ) {
    var modulename, moduleRoot, mainPath, sandbox, sandboxNamespace, requireConfig

    modulename = options.modulename

    moduleRoot = this.configuration.moduleRoot + modulename
    mainPath = moduleRoot + '/main'

    sandboxfactory.delegateCoreApi( core.api.public )

    sandbox = sandboxfactory.create({
      element: options.element
    })

    sandboxNamespace = moduleRoot + '/sandbox'

    if( !require.defined(sandboxNamespace) ) {
      define(
        sandboxNamespace,[
        ],
        sandbox
      )
    }

    requireConfig = { map: {} }

    requireConfig.map[ moduleRoot ] = {
      'sandbox': sandboxNamespace
    }
    
    require(requireConfig, [ mainPath ], 
      function( main ) {
        if( typeof main !== 'function' ) {
          core.unloadModule( modulename )
          callback( TypeError('Module returned value not of type function') )
        } else {
          callback( null, main )
        }
      },
      function( error ) {
        core.unloadModule( modulename )
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
    var definedModules, moduleRoot, sandboxNamespace, name

    definedModules = require.s.contexts._.defined
    moduleRoot = this.configuration.moduleRoot + modulename
    sandboxNamespace = moduleRoot + '/sandbox'

    if( require.defined(sandboxNamespace) ) {
      require.undef( sandboxNamespace )
    }

    for( name in definedModules ) {
      if( definedModules.hasOwnProperty(name) && name.indexOf(modulename) !== -1 ) {
        require.undef( name )
      }
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
  core.moduleIsStarted = function( modulename ) {
    var moduleRoot, mainPath

    moduleRoot = this.configuration.moduleRoot + modulename
    mainPath = moduleRoot + '/main'

    return require.defined( mainPath )
  }

  /**
    Load and start a module by running the returned main function with a new sandbox object.
    @public
    @type Function
    @param {String} modulename The name of the namespace/folder that contains the module
    @param {Object} options Options for the module and sandbox
    @param options.element The element to restrict dom access to
    @returns {cerebral/core} core
  */
  core.start = function( modulename, options ) {
    if( core.moduleIsStarted(modulename) )
      return core

    core.loadModule({
      modulename: modulename,
      element: options.element
    }, 
    function( err, main ) {
      if( err ) {
        throw err
      }
      try {
        main()
      } catch( e ) {
        console.log( 'core.start: ' + modulename + ' threw exception: ', e)
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
    if( !core.moduleIsStarted(modulename) )
      return core

    core.unloadModule( modulename )

    return core
  }

  return core
})