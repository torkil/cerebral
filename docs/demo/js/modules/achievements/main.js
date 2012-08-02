define([
  "sandbox",
  "underscore",
  "./collections/Achievements",
  "./views/Achievements"
], 
function( sandbox, _, Achievements, AchievementsView ){
  
  return function main() {

    var achievements = new Achievements()

    achievements.reset( window.bootstrap.achievements  )

    sandbox.subscribe("todos.firstTodoAdded", function() {

      var completed = achievements
                      .where({ tag: "firsttodo" })

      _(completed).invoke("complete")
    })

    var appView = new AchievementsView({
      el: sandbox.element,
      collection: achievements
    })

    appView.render()

  }

})