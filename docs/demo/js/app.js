
require([
  "cerebral/application/core",
  "jquery"
],
function( core, $ ) {

  core.configure({
    moduleRoot: 'app/modules/'
  })

  core.start("todos", {
    element: "#todos",
    onDomReady: true
  })

  core.start("achievements", {
    element: "#achievements",
    onDomReady: true
  })

})