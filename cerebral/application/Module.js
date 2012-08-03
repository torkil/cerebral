define(
"cerebral/application/Module", [
  "jquery",
  "underscore"
], 
function( $, _ ){
  
  function Module( attributes ) {
    if( !attributes['name'] ||
        !attributes['root'] ) {
      throw new TypeError( 'Module attributes must contain name and root' )
    }

    attributes = _.extend({}, attributes)

    this.name = attributes[ 'name' ]
    this.root = attributes[ 'root' ]
    this.path = this.root + this.name
    
    this.element = attributes[ 'element' ]
    
    this.mainPath = this.path + "/main"
    this.sandboxPath = this.name + "/sandbox"
  }

  Module.prototype.emptyElement = function() {
    if( this.element ) {
      $( this.element ).empty()
    }
  }

  Module.prototype.loadDefinition = function( definition ) {
    var main, destruct
    if( typeof definition === 'function' ) {
      main = definition
    } else if( typeof definition === 'object' ) {
      if( definition.main ) {
        main = definition.main
      } else {
        throw new TypeError( "when definiton is object it must contain a main method/property" )
      }
    } else {
      
      throw new TypeError( "definition must be function or object" )
    }
    if( typeof definition.destruct === 'function' ) {
      destruct = definition.destruct
    } else if( typeof definition.destruct !== 'undefined' ) {
      throw new TypeError( "definition.destruct must be function" )
    }
    this.main = main
    this.destruct = destruct
  }

  return Module
})