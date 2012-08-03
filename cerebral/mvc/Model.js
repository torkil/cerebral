
/**
  @class Model Data models
  @extends Backbone.Model
  @see Backbone.js Model
  @requires [cerebral/lib/Backbone]
  @exports Model
*/
define(
"cerebral/mvc/Model", [
  "underscore",
  "cerebral/lib/Backbone"
],
function( _, Backbone ) {
  
  /**
    Creates a new Model
    @public
    @constructor
  */
  var Model = Backbone.Model.extend({
    constructor: function() {
      Backbone.Model.prototype.constructor.apply( this, arguments )
    }
  })

  /**
    Get a value on the object. Applies getter if there is one.
    @public
    @type Function
    @augments Backbone.Model.prototype.get
  */
  Model.prototype.get = function( attr ) {
    var value, getter

    value = this.attributes[ attr ]
    getter = this[ 'get_' + attr ] || 0

    if( getter ) {
      return getter.call( this, value )
    }

    return value
  }

  /**
    Get a value on the object. Applies setter if there is one.
    @public
    @type Function
    @augments Backbone.Model.prototype.set
  */
  Model.prototype.set = function( key, value, options ) {
    var attrs, attr, setter

    if( _.isObject(key) ) {
      attrs = key
      options = value
    } else {
      attrs = {}
      attrs[ key ] = value
    }

    for( attr in attrs ) {
      setter = this[ 'set_' + attr ] || 0
      if( setter ) {
        attrs[ attr ] = setter.call( this, attrs[attr] )
      }
    }
    
    Backbone.Model.prototype.set.call( this, attrs, options )
  }

  return Model
})