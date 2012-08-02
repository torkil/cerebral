
require([
  "cerebral/application/core",
  "jquery"
]
,function( core, $ ) {

  core.configure({
    moduleRoot: 'app/modules/'
  })

  $(document).ready(function() {

    core.start("todos", {
      element: "#todos"
    })

    core.start("achievements", {
      element: "#achievements"
    })

  })

})