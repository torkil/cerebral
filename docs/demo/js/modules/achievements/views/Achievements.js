define([
  "achievements/sandbox",
  "cerebral/mvc/View",
  "./Achievement"
], 
function( sandbox, View, AchievementView ){
  
  var Achievements

  Achievements = View.extend({

    template: $('#achievements-template').html(),

    render: function() {

      html = _.template( this.template )

      this.$el.html( html )

      var achievementlist = this.$el.find('.list')      
      achievementlist.empty()

      this.collection.each(function( achievement ) {

        var achievementView = new AchievementView({
          model: achievement
        })

        achievementView.render()

        achievementlist.append( achievementView.el )
        
        this.subviews.attach([ achievementView ])

      }, this)

    }

  })

  return Achievements
})