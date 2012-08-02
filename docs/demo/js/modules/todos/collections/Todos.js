
define([
  "sandbox",
  "cerebral/mvc/Collection",
  "../models/Todo"
], 
function( sandbox, Collection, Todo ){
  
  var Todos

  Todos = Collection.extend({
    
    model: Todo,
    firstAdd: true,
    firstRemove: true,

    initialize: function() {
      this.bindToOnce( this, "add", this.onFirstAdd, this )
      this.bindToOnce( this, "remove", this.onFirstRemove, this )
    },

    onFirstAdd: function( todo ) {
      sandbox.publish( 'todos.firstTodoAdded', todo )
    },

    onFirstRemove: function( todo ) {
      sandbox.publish( 'todos.firstTodoRemoved', todo )
    }

  })

  return Todos
})