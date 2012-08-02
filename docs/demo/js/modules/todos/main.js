define([
  "sandbox",
  "./collections/Todos",
  "./views/Todos"
], 
function( sandbox, Todos, TodosView ){
  
  return function main() {

    var todos = new Todos()

    todos.reset( window.bootstrap.todos )

    var moduleView = new TodosView({
      el: sandbox.element,
      collection: todos
    })

    moduleView.render()

  }

})