
require([
  "cerebral/application/core",
  "backbone",
  "backboneLocalStorage",
  "jquery",
  "cerebral/application/sandboxfactory"
],
function( core, Backbone, BackboneLocalStorage, $, sandboxfactory ) {
  
  window.core = core
  BackboneLocalStorage( Backbone )

  core.configure({
    moduleRoot: 'app/modules/'
  })

  sandboxfactory.permissions.extend({
    "todos": {
      "admin": false
    },
    "achievements": {
      "admin": false
    }
  })

  /* Start modules */
  core.start("todos", {
    onDomReady: true,
    sandbox: {
      element: "#todos"
    }
  })

  core.start("achievements", {
    onDomReady: true,
    sandbox: {
      element: "#achievements"
    }
  })

  core.start("admin", {
    onDomReady: true,
    sandbox: {
      element: "#admin"
    }
  })

  
  /* Subscripe to admin events */
  core.subscribe("admin::starttodos", function() { 

    core.start("todos", {
      onDomReady: true,
      sandbox: {
        element: "#todos"
      }
    })

  })

  core.subscribe("admin::stoptodos", function() { 
    core.stop( "todos" ) 
  })

  core.subscribe("admin::startachievements", function() { 
    
    core.start("achievements", {
      onDomReady: true,
      sandbox: {
        element: "#achievements"
      }
    })
    
  })

  core.subscribe("admin::stopachievements", function() { 
    core.stop( "achievements" ) 
  })

})