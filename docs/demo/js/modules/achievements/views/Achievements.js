define([
  "sandbox",
  "cerebral/mvc/View",
  "./Achievement"
], 
function( sandbox, View, AchievementView ){
  
  var Achievements

  Achievements = View.extend({

    render: function() {

      var achievementlist = this.$el.find('.list')      
      achievementlist.empty()

      this.collection.each(function( achievement ) {

        var achievementView = new AchievementView({
          model: achievement
        })

        achievementView.render()

        achievementlist.append( achievementView.el )
      }, this)

    }

  })

  return Achievements
})