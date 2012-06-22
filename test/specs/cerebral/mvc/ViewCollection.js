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
      it("should throw error if superview supplied in options and not a Backbone.View instance", function() {
        expect(function() {
          new ViewCollection({
            superview: "string"
          })
        }).to.throwException(function(excpetion) {
          expect(excpetion).to.be.a(TypeError)
        })
      })
    })
    describe("ViewCollection.prototype.attach", function() {
      it("should increment the instances length attribute", function() {
        var vc = new ViewCollection()
        vc.attach([ new Backbone.View() ])
        vc.attach([ new Backbone.View() ])
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
      it("should set the added subviews superview to the viewCollections superview", function() {
        var vc = new ViewCollection({
          superview: superView
        })
        var subview = new Backbone.View()
        vc.attach([ subview] )
        expect(subview.superview).to.be.ok()
      })
      it("if parameter is array should use the cid of the views for key", function() {
        var vc = new ViewCollection(),
          subViewA = new View(),
          subViewB = new View(),
          subViewC = new View(),
          subViewD = new View(),
          foundCids = {}
        vc.attach([ subViewA, subViewB, subViewC, subViewD ])
        expect(vc.length).to.equal(4)
        _.each(vc.views, function(view, cid) {
          console.log(view, cid);
          expect(view.cid).to.equal(cid)
          foundCids[view.cid] = "found"
        })
        expect(foundCids[subViewA.cid]).to.equal("found")
        expect(foundCids[subViewB.cid]).to.equal("found")
        expect(foundCids[subViewC.cid]).to.equal("found")
        expect(foundCids[subViewD.cid]).to.equal("found")
      })
      it("should emit an attach event passing the view to the callback", function() {
        var vc = new ViewCollection(),
          subView = new View(),
          attachedView = null
        vc.on('attach', function(view) {
          attachedView = view
        })
        vc.attach([ subView ])
        expect(attachedView).to.equal(subView)
      })
    })
    describe("ViewCollection.prototype.detach", function() {
      it("should take a cid and remove the view with the cid from the collection", function() {
        var vc = new ViewCollection(),
          subViewA = new View(),
          subViewB = new View()
        
      })
    })
  })
})