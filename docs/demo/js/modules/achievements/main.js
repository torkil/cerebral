define([
  "sandbox",
  "./collections/Achievements",
  "./views/Achievements"
], 
function( sandbox, Achievements, AchievementsView ){
  
  return function main() {

    var achievements = new Achievements()

    achievements.reset( window.bootstrap.achievements  )

    var stats = {
      nrOfTodosAdded: 0
    }

    sandbox.subscribe("todos.add", function() {
      stats.nrOfTodosAdded++
      if( stats.nrOfTodosAdded === 1 ) {
        achievements.complete({ tag: "firsttodo" })
      }
      if( stats.nrOfTodosAdded === 3 ) {
        achievements.complete({ tag: "threetodos" })
      }
    })

    sandbox.subscribe("todos.remove", function() {
      achievements.complete({ tag: "removetodo" })

      sandbox.unsubscribe("todos.remove")
    })

    var moduleView = new AchievementsView({
      el: sandbox.element,
      collection: achievements
    })

    moduleView.render()

  }

})