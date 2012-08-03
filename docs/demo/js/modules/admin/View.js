define([
  "admin/sandbox",
  "cerebral/mvc/View"
], function( sandbox, View ){
  
  var AdminView = View.extend({

    events: {
      "click .start.todos": "starttodos",
      "click .stop.todos": "stoptodos",
      "click .start.achievements": "startachievements",
      "click .stop.achievements": "stopachievements"
    },

    starttodos: function() {
      sandbox.publish( "starttodos" )
    },

    stoptodos: function() {
      sandbox.publish( "stoptodos" )
    },

    startachievements: function() {
      sandbox.publish( "startachievements" )
    },

    stopachievements: function() {
      sandbox.publish( "stopachievements" )
    }

  })

  return AdminView
})