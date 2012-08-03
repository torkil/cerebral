define([
  "achievements/sandbox",
  "./collections/Achievements",
  "./views/Achievements"
], 
function( sandbox, Achievements, AchievementsView ){
  
  

  return {
    main: function () {

      var achievements = new Achievements()

      if( !window.localStorage.achievements ) {
        _.each(window.bootstrap.achievements, function( achievement ) {
          achievements.create( achievement )  
        })
      } else {
        achievements.fetch()
      }
      
      if( !window.stats ) {
        window.stats = {
          nrOfTodosAdded: 0
        }
      }

      function onTodoAdd() {
        stats.nrOfTodosAdded++
        if( stats.nrOfTodosAdded === 1 ) {
          achievements.complete({ tag: "firsttodo" })
        }
        if( stats.nrOfTodosAdded >= 3 ) {
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

      sandbox.subscribe( "todos.add", onTodoAdd )

      sandbox.subscribe( "todos.remove", onTodoRemove )

      sandbox.subscribe( "todos.modelChange", onModelChange )

      var moduleView = new AchievementsView({
        collection: achievements
      })

      moduleView.render()
      
      sandbox.element.append( moduleView.el )

    },

    destruct: function( done ) {
      
      sandbox.element
        .find('#wrapper')
        .fadeOut( 300, done )
        
    }

  }

})