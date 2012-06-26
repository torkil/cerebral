require([
  "backbone",
  "cerebral/Router",
  "cerebral/mvc/View"
], function(Backbone, Router, View) {
  
  var ViewClass = View.extend({
    render: function() {
      this.$el.html(([
        "<a id='nohref'></a>",
        "<a id='pushstate' href='/foo/bar'></a>",
        "<a id='hashstate' href='#/foo/bar'></a>"
      ]).join(''))
    }
  })

  describe("cerebral/Router", function() {
    describe("constructor", function() {
      it("should return a new router that extends Backbone.Router", function() {
        var router = new Router()
        expect(router).to.be.a(Backbone.Router)
      })
    })
    describe("attaching delegate view", function() {
      it("should bind Router.prototype.clickListener to fire when a link is clicked inside the view", function() {
        var router = new Router(),
          delegateView = new ViewClass(),
          linksClicked = 0
        delegateView.render()
        router.clickListener = function(event) { linksClicked++ }
        router.delegateViews.attach([ delegateView ])
        expect(linksClicked).to.equal(0)
        delegateView.$el.find('a#nohref').trigger('click')
        expect(linksClicked).to.equal(1)
        delegateView.$el.find('a#pushstate').trigger('click')
        expect(linksClicked).to.equal(2)
      })
      it("should rebind Router.prototype.clickListener if view.setElement is called", function() {
        var router = new Router(),
          delegateView = new ViewClass(),
          linksClicked = 0
        delegateView.render()
        router.clickListener = function(event) { linksClicked++ }
        router.delegateViews.attach([ delegateView ])
        expect(linksClicked).to.equal(0)
        delegateView.$el.find('a#nohref').trigger('click')
        expect(linksClicked).to.equal(1)
        delegateView.setElement($("<div><a id='newlink'></a></div>"))
        delegateView.$el.find('a#newlink').trigger('click')
        expect(linksClicked).to.equal(2)
      })
    })
    describe("detaching a view", function() {
      it("should unbind Router.prototype.clickListener from fireing when a link is clicked inside the view", function() {
        var router = new Router(),
          delegateView = new ViewClass(),
          linksClicked = 0
        delegateView.render()
        router.clickListener = function(event) { linksClicked++ }
        router.delegateViews.attach([ delegateView ])
        expect(linksClicked).to.equal(0)
        delegateView.$el.find('a#nohref').trigger('click')
        expect(linksClicked).to.equal(1)
        router.delegateViews.detach(delegateView)
        delegateView.$el.find('a#nohref').trigger('click')
        delegateView.$el.find('a#nohref').trigger('click')
        expect(linksClicked).to.equal(1)
      })
    })
  })

})