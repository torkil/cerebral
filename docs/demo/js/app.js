
require([
  "cerebral/application/core",
  "backbone",
  "backboneLocalStorage",
  "jquery"
],
function( core, Backbone, BackboneLocalStorage, $ ) {
  

  BackboneLocalStorage( Backbone )

  core.configure({
    moduleRoot: 'app/modules/'
  })


  /* Start modules */
  core.start("todos", {
    element: "#todos",
  })

  core.start("achievements", {
    element: "#achievements",
    onDomReady: true
  })

  core.start("admin", {
    element: "#admin",
    onDomReady: true
  })

  
  /* Subscripe to admin events */
  core.subscribe("admin.starttodos", function() { 
    core.start("todos", {
      element: "#todos",
    })
  })

  core.subscribe("admin.stoptodos", function() { 
    core.stop( "todos" ) 
  })

  core.subscribe("admin.startachievements", function() { 
    core.start("achievements", {
      element: "#achievements"
    }) 
  })

  core.subscribe("admin.stopachievements", function() { 
    core.stop( "achievements" ) 
  })

})