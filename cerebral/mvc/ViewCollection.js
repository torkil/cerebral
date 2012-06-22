define(
'cerebral/mvc/ViewCollection',[
  'cerebral/lib/EventEmitter',
  'underscore',
  'backbone',
], 
function( EventEmitter, _, Backbone ) {
  
  function ViewCollection( options ) {
    _.extend( this, options )
    if( this.superview && !(this.superview instanceof Backbone.View) )
      throw new TypeError( 'ViewCollection received attribute superview not instance of Backbone.View' )
  }

  ViewCollection.prototype = new EventEmitter()

  ViewCollection.prototype.views = {}

  ViewCollection.prototype.length = 0

  function attach( name, subview ) {
    if( typeof name !== 'string' )
      throw new TypeError( 'parameter name not of type "string"' )
    if( !(subview instanceof Backbone.View) )
      throw new TypeError( 'subview parameter not instance of Backbone.View' )
    if( this.superview ) {
      subview.superview = this.superview
    }
    this.views[ name ] = subview
    this.trigger( 'attach', subview )
    this.length++
  }

  function attachArray( array ) {
    _.each(array, function( subview ) {
      attach.call( this, subview.cid, subview )
    }, this)
  }

  function attachObject( obj ) {
    _.each(obj, function( name, subview ) {
      attach.call(this, name, subview)
    }, this)
  }

  ViewCollection.prototype.attach = function( subviews ) {
    if( _.isArray(subviews) )
      return attachArray.call( this, subviews )
    if( typeof subviews === 'object' )
      return attachObject.call( this, subviews )
    throw new TypeError( 'parameter subviews not of correct type. Accepted: object{name: subview}, subviews, array of subviews' )
  }

  function detachByInstance( view ) {
    var i, test
    for ( i = this.views.length - 1; i >= 0; i-- ) {
      test = this.views[ i ]
      if( view === test ) {
        delete this.views[ i ]
        this.length--
        //TODO: emit detach 
      }
    }
  }

  function detachByCid( cid ) {
    if( this.views[cid] ) {
      delete this.views[ cid ]
      this.length--
      //TODO: emit detach
    } 
  }

  ViewCollection.prototype.detach = function( cidOrView ) {
    if( typeof cidOrView === 'string' ) {
      detachByCid.call( this, cidOrView )
    }
    if( typeof cidOrView === 'object' ) {
      if( !(cidOrView instanceof Backbone.View) )
        throw new TypeError( 'subview parameter not instance of Backbone.View' )
      detachByInstance.call( this, cidOrView )
    }
  }

  return ViewCollection
})