
define([
  "sandbox",
  "cerebral/mvc/Collection",
  "../models/Todo"
], 
function( sandbox, Collection, Todo ){
  
  var Todos

  Todos = Collection.extend({
    
    model: Todo,

    initialize: function() {

      this.bindTo( this, "add", this.onAdd, this )
      this.bindTo( this, "remove", this.onRemove, this )

    },

    onAdd: function( todo ) {
      sandbox.publish( 'todos.add', todo )
    },

    onRemove: function( todo ) {
      sandbox.publish( 'todos.remove', todo )
    }

  })

  return Todos
})