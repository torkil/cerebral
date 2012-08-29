
/**
  @class Interface For interfacing between modules. Higher abstraction than regular pub sub.
  @exports Interface
  @requires [jquery, underscore]
*/
define(
"cerebral/application/classes/Interface", [
  "jquery",
  "underscore",
  "cerebral/lib/Backbone"
], 
function( $, _, Backbone ){
  
  function Request() {}

  function Response( options ) {
    _.extend( this, options ||{})
  }

  Response.prototype.send = function() {
    var args = [].slice.call( arguments )

  }

  Response.prototype.end = function() {
    var args = [].slice.call( arguments )
  }

  /**
    Creates a new Interface
    @public
    @constructor
  */
  function Interface( implementation ) {
    this.implementation = implementation
  }

  _.extend( Interface.prototype, Backbone.Events )

  Interface.prototype.request = function( handler ) {
    if( typeof this.implementation === 'object' ) {}
    if( typeof this.implementation === 'function' ) {}
  }

  return Interface
})