define([
  "cerebral/mvc/View",
  "underscore"
], function( View, _ ){
  
  var TodoView

  TodoView = View.extend({

    tagName: 'li',
    className: 'todo',

    template: $('#todo-template').html(),

    events: {
      "click .completed": "toggleCompleted",
      "click .remove": "removeTodo"
    },

    render: function() {
      var html
      html = _.template( this.template, this.model.toJSON() )
      this.$el.html( html )
    },

    toggleCompleted: function() {
      var isChecked
      isChecked = this.$el.find('.completed').attr("checked")
      if( isChecked ) {
        this.model.set( "completed", true )
      } else {
        this.model.set( "completed", false )
      }
      this.model.save()
    },

    removeTodo: function() {
      this.model.destroy()
    }

  })

  return TodoView
})