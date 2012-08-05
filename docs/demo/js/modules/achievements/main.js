define([
  "achievements/sandbox",
  "./collections/Achievements",
  "./views/Achievements"
], 
function( sandbox, Achievements, AchievementsView ){
  
  var stats, moduleView

  stats = {
    nrOfTodosAdded: function( val ) {
      if( val ) {
        return localStorage.setItem( 'nrOfTodosAdded', val )
      } else {
        return parseFloat( localStorage.getItem( 'nrOfTodosAdded' ) ) || 0
      }
    }
  }

  function resetAchievements( achievements ) {
    achievements.reset([])
    _.each(window.bootstrap.achievements, function( achievement ) {
      achievements.create( achievement )  
    })
  }


  function main() {

    var achievements = new Achievements()

    if( !window.localStorage.achievements ) {
      resetAchievements( achievements )
    } else {
      achievements.fetch()
    }

    function onTodoAdd() {
      stats.nrOfTodosAdded( stats.nrOfTodosAdded() + 1 )
      if( stats.nrOfTodosAdded() === 1 ) {
        achievements.complete({ tag: "firsttodo" })
      }
      if( stats.nrOfTodosAdded() >= 3 ) {
        achievements.complete({ tag: "threetodos" })
      }
    }

    function onTodoRemove() {
      achievements.complete({ tag: "removetodo" })
      sandbox.unsubscribe("todos.remove")
    }

    function onModelChange( model ) {
      if( model.get('completed') )
        achievements.complete({ tag: "firstcomplete" })
    }

    function onLocalStorageClear() {
      window.localStorage.clear()
      resetAchievements( achievements )
      moduleView.render()
    }

    sandbox.subscribe( "todos.add", onTodoAdd )
    sandbox.subscribe( "todos.remove", onTodoRemove )
    sandbox.subscribe( "todos.modelChange", onModelChange )
    sandbox.subscribe( "admin.reset", onLocalStorageClear )

    moduleView = new AchievementsView({
      collection: achievements
    })

    moduleView.render()
    
    sandbox.element.append( moduleView.el )

  }

  function destruct( done ) {
    
    moduleView.hide( done )
      
  }
  
  return { main: main, destruct: destruct }

})