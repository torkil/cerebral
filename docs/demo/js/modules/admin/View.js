define([
  "admin/sandbox",
  "cerebral/mvc/View"
], function( sandbox, View ){
  
  var AdminView = View.extend({

    events: {
      "click .start.todos": "starttodos",
      "click .stop.todos": "stoptodos",
      "click .start.achievements": "startachievements",
      "click .stop.achievements": "stopachievements",
      "click .reset": "reset"
    },

    starttodos: function() {
      sandbox.publish( "admin.starttodos" )
    },

    stoptodos: function() {
      sandbox.publish( "admin.stoptodos" )
    },

    startachievements: function() {
      sandbox.publish( "admin.startachievements" )
    },

    stopachievements: function() {
      sandbox.publish( "admin.stopachievements" )
    },

    reset: function() {
      window.localStorage.clear()
      sandbox.publish( "admin.reset" )
    }

  })

  return AdminView
})