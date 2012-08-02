
define([
  "cerebral/mvc/View",
  "../models/Todo",
  "./Todo"
], function( View, TodoModel, TodoView ){
  
  var TodosView

  TodosView = View.extend({

    events: {
      "keyup .new-todo": "newTodoInput"
    },

    initialize: function() {
      this.bindTo( this.collection, "add", this.render, this )
      this.bindTo( this.collection, "remove", this.render, this )
    },

    render: function() {
      
      var todolist = this.$el.find('.list')      
      todolist.empty()

      this.collection.each(function( todo ) {

        var todoview = new TodoView({
          model: todo
        })

        todoview.render()

        todolist.append( todoview.el )
      }, this)
    },

    newTodoInput: function( event ) {
      var description, todo
      if( event.keyCode === 13 ) {
        
        description = this.$el.find(".new-todo").val()

        todo = new TodoModel({
          description: description
        })

        this.collection.add( todo )

        this.$el.find(".new-todo").val('')
      }
    }

  })

  return TodosView
})