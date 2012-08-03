define([
  "todos/sandbox",
  "./collections/Todos",
  "./views/Todos"
], 
function( sandbox, Todos, TodosView ){

  return {

    main: function() {
      
      var todos = new Todos()

      if( !window.localStorage.todos ) {
        _.each(window.bootstrap.todos, function( todo ) {
          todos.create( todo )  
        })
      } else {
        todos.fetch()
      }

      this.moduleView = new TodosView({
        collection: todos
      })

      this.moduleView.render()
      
      sandbox.element.append( this.moduleView.el )

    },

    destruct: function( done ) {

      sandbox.element
        .find('#wrapper')
        .fadeOut( 300, done )
        
    }

  }

})