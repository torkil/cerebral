
/**
  @class Interface For interfacing between modules. Higher abstraction than regular pub sub.
  @exports Interface
  @requires [jquery, underscore]
*/
define(
"cerebral/application/classes/Interface", [
  "jquery",
  "underscore"
], 
function( $, _ ){
  
  /**
    Creates a new Interface
    @public
    @constructor
  */
  function Interface() {}

  return Interface
})