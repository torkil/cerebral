define([
  "achievements/sandbox",
  "cerebral/mvc/View"
], 
function( sandbox, View ){
  
  var Achievement

  Achievement = View.extend({

    tagName: 'li',
    className: 'achievement',

    template: $('#achievement-template').html(),

    initialize: function() {
      this.bindTo( this.model, "change", this.render, this )
    },

    render: function() {
      var html
      html = _.template( this.template, this.model.toJSON() )
      this.$el.html( html )
      if( this.model.get('completed') )
        this.$el.addClass("completed")
    }

  })

  return Achievement
})