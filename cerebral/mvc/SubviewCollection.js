define(
'cerebral/mvc/SubviewCollection',[
  'underscore',
  'backbone'
], 
function( _, Backbone ) {
  
  function SubviewCollection( options ) {
    this.views = {}
    this.length = 0
  }

  SubviewCollection.prototype = _.extend(SubviewCollection.prototype, Backbone.Events)

  SubviewCollection.EVENTS = {
    DETACH: function( instance, name, view ) {
      instance.trigger('detach', name, view)
    },
    ATTACH: function( instance, name, view ) {
      instance.trigger( 'attach', name, view )
    }
  }

  SubviewCollection.underscoreMethods = [
    "each","map","reduce","reduceRight","find",
    "filter","reject","all","any","include",
    "invoke","pluck","max","min","sortBy",
    "groupBy","sortedIndex","shuffle","toArray","size"
  ]

  _.each(SubviewCollection.underscoreMethods, function( methodName ) {
    SubviewCollection.prototype[ methodName ] = function() {
      var args
      args = Array.prototype.slice.call( arguments, 0 )
      args.unshift ( this.views )
      return _[ methodName ].apply( this, args )
    }
  })

  function attach( name, subview ) {
    if( typeof name !== 'string' )
      throw new TypeError( 'parameter name not of type "string"' )
    if( !(subview instanceof Backbone.View) )
      throw new TypeError( 'subview parameter not instance of Backbone.View' )
    if( this.views[name] )
      throw new Error( 'subview with that name allready attached' )
    this.views[ name ] = subview
    SubviewCollection.EVENTS.ATTACH( this, name, subview )
    this.length++
  }

  function attachArray( array ) {
    _.each(array, function( subview ) {
      attach.call( this, subview.cid, subview )
    }, this)
  }

  function attachObject( obj ) {
    _.each(obj, function( subview, name ) {
      attach.call( this, name, subview )
    }, this)
  }

  SubviewCollection.prototype.attach = function( subviews ) {
    if( _.isArray(subviews) )
      return attachArray.call( this, subviews )
    if( typeof subviews === 'object' )
      return attachObject.call( this, subviews )
    throw new TypeError( 'parameter subviews not of correct type. Accepted: object{name: subview}, subviews, array of subviews' )
  }

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
      SubviewCollection.EVENTS.DETACH( this, detachedView.name, detachedView.instance )
    }
  }

  SubviewCollection.prototype.detachAll = function( options ) {
    this.each(function( view, name ) {
      this.detach( name, options )
    }, this)
  }

  return SubviewCollection
})