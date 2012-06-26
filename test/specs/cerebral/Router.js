require([
  "backbone",
  "cerebral/Router"
], function(Backbone, Router) {
  
  describe("cerebral/Router", function() {
    describe("constructor", function() {
      it("should return a new router that extends Backbone.Router", function() {
        var router = new Router()
        expect(router).to.be.a(Backbone.Router)
      })
    })
    describe("Router.extracPath", function() {
      it("should extract the path from the given url", function() {
        expect(Router.extractPath("http://www.site.com/foo/bar")).to.equal("/foo/bar")
        expect(Router.extractPath("https://www.site.com/foo/bar")).to.equal("/foo/bar")
        expect(Router.extractPath("www.site.com/foo/bar")).to.equal("/foo/bar")
        expect(Router.extractPath("site.com/foo/bar")).to.equal("/foo/bar")
      })
    })
  })

})