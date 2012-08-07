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
  
  var moduleView, todos

  function main() {
      
    todos = new Todos()

    if( !window.localStorage.todos ) {
      resetTodos( todos )
    } else {
      todos.fetch()
    }

    moduleView = new TodosView({
      collection: todos
    })

    sandbox.subscribe( "admin.reset", function() {
      window.localStorage.clear()
      resetTodos( todos )
      moduleView.render()
    })

    moduleView.render()
    
    sandbox.element.append( moduleView.el )

  }

  function destruct( done ) {
    
    moduleView.hide(function() {

      todos.unbindAll()
      moduleView.dispose()
      
      done()
    })

  }

  return { main: main, destruct: destruct }

})