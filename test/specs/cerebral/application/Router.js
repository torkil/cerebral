require([
  "backbone",
  "cerebral/application/Router",
  "cerebral/mvc/View"
], function(Backbone, Router, View) {
  
  /*
   * SETUP
  */
  var ViewClass, RouterClass

  before(function() {

    ViewClass = View.extend({
      render: function() {
        this.$el.html(([
          "<a id='nohref'></a>",
          "<a id='pushstate' href='/foo/bar'></a>",
          "<a id='hashstate' href='#/foo/bar'></a>"
        ]).join(''))
      }
    })    

    RouterClass = Router.extend({
      routes: { foo: 'bar' }
    })

    new RouterClass()
    Backbone.history.start({pushState: true})

  })

  
  /*
   * TESTS
  */
  describe("cerebral/Router", function() {

    describe("constructor", function() {

      it("should return a new router that extends Backbone.Router", function() {
        
        var router = new RouterClass()
        expect(router).to.be.a(Backbone.Router)

      })

    })

    describe("Router.sameOrigin", function() {

      it("should return true or false depending if the passed url is of the same origin as current or not", function() {

        expect(Router.sameOrigin({
          port: 80,
          protocol: "http:",
          hostname: "www.foo.bar"
        }, "http://www.foo.bar")).to.equal(true)
        expect(Router.sameOrigin({
          port: 80,
          protocol: "http:",
          hostname: "subdomain.foo.bar"
        }, "http://www.foo.bar")).to.equal(false)
        expect(Router.sameOrigin({
          port: 80,
          protocol: "http:",
          hostname: "subdomain.foo.bar"
        }, "http://subdomain.foo.bar")).to.equal(true)
        expect(Router.sameOrigin({
          port: 88,
          protocol: "http:",
          hostname: "www.foo.bar"
        }, "http://www.foo.bar")).to.equal(false)
        expect(Router.sameOrigin({
          port: 88,
          protocol: "http:",
          hostname: "www.foo.bar"
        }, "http://www.foo.bar:88")).to.equal(true)
        expect(Router.sameOrigin({
          port: 88,
          protocol: "https:",
          hostname: "www.foo.bar"
        }, "http://www.foo.bar:88")).to.equal(false)

      })

    })

    describe("attaching delegate view", function() {

      it("should bind Router.prototype.clickListener to fire when a link is clicked inside the view", function() {
        var router = new RouterClass(),
          delegateView = new ViewClass(),
          linksClicked = 0
        delegateView.render()
        router.clickListener = function() { linksClicked++ }
        router.delegateViews.attach([ delegateView ])
        expect(linksClicked).to.equal(0)
        delegateView.$el.find('a#nohref').trigger('click')
        expect(linksClicked).to.equal(1)
        delegateView.$el.find('a#pushstate').trigger('click')
        expect(linksClicked).to.equal(2)
      })

      it("should rebind Router.prototype.clickListener if view.setElement is called", function() {
        var router = new RouterClass(),
          delegateView = new ViewClass(),
          linksClicked = 0
        delegateView.render()
        router.clickListener = function() { linksClicked++ }
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
        var router = new RouterClass(),
          delegateView = new ViewClass(),
          linksClicked = 0
        delegateView.render()
        router.clickListener = function() { linksClicked++ }
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

    describe("Router.prototype.clickListener", function() {

      it("should call router.navigate with the path + querystring as parameter if the link is sameOrigin", function() {
        var router = new RouterClass(),
          delegateView = new ViewClass(),
          paths = {}
        router.navigate = function(path) {
          paths[path] = true
        }
        delegateView.render()
        router.delegateViews.attach([ delegateView ])
        delegateView.$el.append("<a id='foo-bar' href='/foo/bar'></a>")
        delegateView.$el.append("<a id='foo-lol' href='/foo/lol'></a>")
        delegateView.$el.find('a#foo-bar').trigger("click")
        delegateView.$el.find('a#foo-lol').trigger("click")
        expect(paths["/foo/bar"]).to.be.ok()
        expect(paths["/foo/lol"]).to.be.ok()
      })

    })

  })

})