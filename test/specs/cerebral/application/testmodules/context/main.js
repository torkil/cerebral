define([
  "context/sandbox"
], function( sandbox ){
  
  return {
    prop: 'prop',
    setFoo: function() {
      this.foo = 'bar'
    },
    main: function(){
      this.setFoo()
      this.mainset = 'mainset'
      sandbox.mainThis( this )
    },
    destruct: function( done ) {
      this.destructset = 'destructset'
      sandbox.destructThis( this )
      done()
    }
  }

})