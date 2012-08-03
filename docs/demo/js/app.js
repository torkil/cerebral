
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

  core.subscribe("starttodos", function() { 
    core.start("todos", {
      element: "#todos",
    })
  })

  core.subscribe("stoptodos", function() { 
    core.stop( "todos" ) 
  })

  core.subscribe("startachievements", function() { 
    core.start("achievements", {
      element: "#achievements",
      onDomReady: true
    }) 
  })

  core.subscribe("stopachievements", function() { core.stop( "achievements" ) })


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

})