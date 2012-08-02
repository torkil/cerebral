
define([
  "cerebral/mvc/Model"
], 
function( Model ) {

  var Todo

  Todo = Model.extend({
    defaults: {
      description: "No description given",
      completed: false
    }
  })

  return Todo
})