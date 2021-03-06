
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

    template: $('#todos-template').html(),

    initialize: function() {
      this.bindTo( this.collection, "add", this.render, this )
      this.bindTo( this.collection, "remove", this.render, this )
    },

    render: function() {
      
      var html

      html = _.template( this.template )

      this.$el.html( html )

      var todolist = this.$el.find('.list')      
      todolist.empty()

      this.collection.each(function( todo ) {

        var todoview = new TodoView({
          model: todo
        })

        todoview.render()

        todolist.append( todoview.el )

        this.subviews.attach([ todoview ])

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

        todo.save()

        this.$el.find(".new-todo").val('')
      }
    },

    hide: function( callback ) {
      this.$el.fadeOut( 300, callback )
    }

  })

  return TodosView
})