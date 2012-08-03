define([
  "todos/sandbox",
  "./collections/Todos",
  "./views/Todos"
], 
function( sandbox, Todos, TodosView ){

  function resetTodos( todos ) {

    todos.reset([])

    _.each(window.bootstrap.todos, function( todo ) {
      todos.create( todo )  
    })
  }

  return {

    main: function() {
      
      var todos = new Todos()

      if( !window.localStorage.todos ) {
        resetTodos( todos )
      } else {
        todos.fetch()
      }

      var moduleView = new TodosView({
        collection: todos
      })

      sandbox.subscribe( "admin.reset", function() {
        window.localStorage.clear()
        resetTodos( todos )
        moduleView.render()
      })

      moduleView.render()
      
      sandbox.element.append( moduleView.el )

    },

    destruct: function( done ) {
      
      sandbox.element
        .find('#wrapper')
        .fadeOut( 300, done )

    }

  }

})