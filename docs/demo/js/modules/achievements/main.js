define([
  "achievements/sandbox",
  "./models/Achievement",
  "./collections/Achievements",
  "./views/Achievements"
], 
function( sandbox, Achievement ,Achievements, AchievementsView ){
  
  var stats, moduleView, achievements

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
    window.localStorage.clear()
    achievements.reset([])
    _.each(window.bootstrap.achievements, function( attrs ) {
      console.log(arguments[1]);
      var achievement = new Achievement( attrs )
      achievements.add( achievement, {silent: true} ) 
      achievements.invoke('save')
    })
    stats.todos.added = 0
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

  function onReset() {
    resetAchievements( achievements )
    moduleView.render()
  }


  function main() {

    achievements = new Achievements()

    if( !window.localStorage.achievements ) {
      resetAchievements( achievements )
    } else {
      achievements.fetch()
    }

    sandbox.subscribe( "todos::add", onTodoAdd )
    sandbox.subscribe( "todos::remove", onTodoRemove )
    sandbox.subscribe( "todos::modelChange", onModelChange )
    sandbox.subscribe( "admin::reset", onReset )

    moduleView = new AchievementsView({
      collection: achievements
    })

    moduleView.render()
    
    sandbox.element.append( moduleView.el )

  }

  function destruct( done ) {
    
    sandbox.unsubscribe( "todos" )

    moduleView.hide(function() {

      achievements.unbindAll()
      moduleView.dispose()

      done()
    })
      
  }
  
  return { main: main, destruct: destruct }

})