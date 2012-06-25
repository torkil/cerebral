
/**
    @class for managing subviews for a view
    @exports cerebral/mvc/SubviewCollection
    @extends Backbone.Events
    @requires [underscore, Backbone]
*/

define(
'cerebral/mvc/SubviewCollection',[
  'underscore',
  'backbone'
], 
function( _, Backbone ) {
  
  /**
      Creates a new SubviewCollection
      @public
      @constructor
      @property {Array} views Internal array of all the views attached
      @property {Number} length The number of attached subviews
  */
  function SubviewCollection( options ) {
    this.views = {}
    this.length = 0
  }

  SubviewCollection.prototype = _.extend(SubviewCollection.prototype, Backbone.Events)

  /**
      Methods borrowed from underscore
      @public
      @static
      @type Object
  */
  SubviewCollection.underscoreMethods = [
    "each","map","reduce","reduceRight","find",
    "filter","reject","all","any","include",
    "invoke","pluck","max","min","sortBy",
    "groupBy","sortedIndex","shuffle","toArray","size"
  ]

  /**
      Implement underscore methods on SubviewCollection.prototype
      @public
      @type Function
      @borrows underscore[methodname] as this[methodname]
  */
  _.each(SubviewCollection.underscoreMethods, function( methodName ) {
    SubviewCollection.prototype[ methodName ] = function() {
      var args
      args = Array.prototype.slice.call( arguments, 0 )
      args.unshift ( this.views )
      return _[ methodName ].apply( this, args )
    }
  })


  /**
    @private
    @type Function
    @param {String} name The name of the view
    @param {Backbone.View|cerebral/mvc/View} name The view to attach
  */
  function attach( name, subview ) {
    if( typeof name !== 'string' )
      throw new TypeError( 'parameter name not of type "string"' )
    if( !(subview instanceof Backbone.View) )
      throw new TypeError( 'subview parameter not instance of Backbone.View' )
    if( this.views[name] )
      throw new Error( 'subview with that name allready attached' )
    this.views[ name ] = subview
    this.trigger( 'attach', name, subview )
    this.length++
  }

  /**
    Attach a array of views
    @private
    @type Function
    @param {Backbone.View|cerebral/mvc/View[]} array Array of views
  */
  function attachArray( array ) {
    _.each(array, function( subview ) {
      attach.call( this, subview.cid, subview )
    }, this)
  }

  /**
    Attach a object of views, keys are names and values are the views
    @private
    @type Function
    @param {Object} obj Keys ar handles as names for the values wich must be Backbone.View or cerebral view
  */
  function attachObject( obj ) {
    _.each(obj, function( subview, name ) {
      attach.call( this, name, subview )
    }, this)
  }

  /**
    Attach view[s] to the collection, delegates to private functions depending on parameter type
    @public
    @type Function
    @param {Array|Object} subview The subview[s] to attach
  */
  SubviewCollection.prototype.attach = function( subviews ) {
    if( _.isArray(subviews) )
      return attachArray.call( this, subviews )
    if( typeof subviews === 'object' )
      return attachObject.call( this, subviews )
    throw new TypeError( 'parameter subviews not of correct type. Accepted: object{name: subview}, subviews, array of subviews' )
  }

  /**
    Detach a view by reference to the view itself
    @private
    @type Function
    @param {Backbone.View|cerebral/mvc/View} instance The view to detach
  */
  function detachByInstance( instance ) {
    var view
    if( this.views[instance.cid] ) {
      view = this.views[ instance.cid ]
      delete this.views[ instance.cid ]
      return {
        name: instance.cid,
        instance: view
      }
    }
  }

  /**
    Detach a view by its name or cid
    @private
    @type Function
    @param {string} name The name or cid of the view
  */
  function detachByName( name ) {
    var view
    if( this.views[name] ) {
      view = this.views[ name ]
      delete this.views[ name ]
      return {
        name: name,
        instance: view
      }
    }
  }

  /**
    Detach view[s] from the collection, delegates to private functions depending on parameter type
    @public
    @type Function
    @param {Backbone.View|cerebral/mvc/View} nameOrView The name or view instance to detach
    @param options options for the detachment
    @param options.dispose Should the view allso call dispose on itself
  */
  SubviewCollection.prototype.detach = function( nameOrView, opts ) {
    var options, detachedView
    options = _.extend({
      dispose: true
    }, opts)
    if( typeof nameOrView === 'string' ) {
      detachedView = detachByName.call( this, nameOrView )
    }
    if( typeof nameOrView === 'object' ) {
      if( !(nameOrView instanceof Backbone.View) )
        throw new TypeError( 'subview parameter not instance of Backbone.View' )
      detachedView = detachByInstance.call( this, nameOrView )
    }
    if( detachedView ) {
      this.length--
      if( detachedView.instance.subviews && detachedView.instance.subviews.length > 0 )
        detachedView.instance.subviews.detachAll( options )
      if( options.dispose )
        detachedView.instance.dispose()
      this.trigger( 'detach', detachedView.name, detachedView.instance )
    }
  }

  /**
    Detach all view[s] from the collection
    @public
    @type Function
    @param options options for the detachment, ref SubviewCollection.prototype.detach
  */
  SubviewCollection.prototype.detachAll = function( options ) {
    this.each(function( view, name ) {
      this.detach( name, options )
    }, this)
  }

  return SubviewCollection
})