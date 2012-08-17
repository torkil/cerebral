
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
    @property {Array} bindings Event bindings. Used by Backbone.View.prototype to handle events.
  */
  var Model = Backbone.Model.extend({
    constructor: function() {

      this.bindings = []

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
    var attributes, attr, setter

    if( _.isObject(key) ) {
      attributes = key
      options = value
    } else {
      attributes = {}
      attributes[ key ] = value
    }

    options = options ? _.clone(options) : {};

    for( attr in attributes ) {
      setter = this[ 'set_' + attr ] || 0
      if( setter ) {
        attributes[ attr ] = setter.call( this, attributes[attr] )
      }
    }

    return Backbone.Model.prototype.set.apply( this, [attributes, options] )
  }

  return Model
})