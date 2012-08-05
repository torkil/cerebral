define([
  "achievements/sandbox",
  "./collections/Achievements",
  "./views/Achievements"
], 
function( sandbox, Achievements, AchievementsView ){
  
  var stats, moduleView

  stats = { todos:{} }

  Object.defineProperty(stats.todos, "added", {
    get: function() {
      return parseFloat( localStorage.getItem('stats.todos.added') ) || 0
    },
    set: function( value ) {
      return localStorage.setItem( 'stats.todos.added', value )
    }
  })

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
      stats.todos.added++
      if( stats.todos.added === 1 ) {
        achievements.complete({ tag: "firsttodo" })
      }
      if( stats.todos.added >= 3 ) {
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