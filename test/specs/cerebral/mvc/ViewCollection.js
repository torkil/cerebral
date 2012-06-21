require([
  "backbone",
  "cerebral/mvc/View",
  "cerebral/mvc/ViewCollection"
], 
function(Backbone, View, ViewCollection) {
  describe("cerebral/mvc/ViewCollection", function() {

    var superView

    beforeEach(function() {
      superView = new View()
    })

    describe("constructor", function() {
      it("should create a new ViewCollection with length 0", function() {
        var vc = new ViewCollection()
        expect(vc).to.be.a(ViewCollection)
        expect(vc.length).to.equal(0)
      })
    })
    describe("attach", function() {
      it("should increment the instances length attribute", function() {
        var vc = new ViewCollection()
        vc.attach(new Backbone.View())
        vc.attach(new Backbone.View())
        expect(vc.length).to.equal(2)
      })
      it("should throw TypeError on receiving other than a Backbone.View", function() {
        var vc = new ViewCollection()
        expect(function() {
          vc.attach("string")
        }).to.throwException(function(excpetion) {
          expect(excpetion).to.be.a(TypeError)
        })
      })
      it('should set the added subviews superview to the viewCollections superview', function() {
        var vc = new ViewCollection({
          superview: superView
        })
        var subview = new Backbone.View()
        vc.attach(subview)
        expect(subview.superview).to.be.ok()
      })
    })
  })
})