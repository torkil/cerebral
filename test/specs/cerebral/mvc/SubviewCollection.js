require([
  "backbone",
  "cerebral/mvc/View",
  "cerebral/mvc/SubviewCollection"
], 
function(Backbone, View, SubviewCollection) {
  describe("cerebral/mvc/SubviewCollection", function() {
    window.SubviewCollection = SubviewCollection
    window.View = View
    var superView

    beforeEach(function() {
      superView = new View()
    })

    describe("constructor", function() {
      it("should create a new SubviewCollection with length 0", function() {
        var vc = new SubviewCollection()
        expect(vc).to.be.a(SubviewCollection)
        expect(vc.length).to.equal(0)
      })
    })
    describe("SubviewCollection.prototype.attach", function() {
      it("should increment the instances length attribute", function() {
        var vc = new SubviewCollection()
        vc.attach([ new Backbone.View() ])
        vc.attach([ new Backbone.View() ])
        expect(vc.length).to.equal(2)
      })
      it("should throw TypeError on receiving other than a Backbone.View", function() {
        var vc = new SubviewCollection()
        expect(function() {
          vc.attach("string")
        }).to.throwException(function(excpetion) {
          expect(excpetion).to.be.a(TypeError)
        })
      })
      it("if parameter is array should use the cid of the views for key", function() {
        var vc = new SubviewCollection(),
          subViewA = new View(),
          subViewB = new View(),
          subViewC = new View(),
          subViewD = new View(),
          foundCids = {}
        vc.attach([ subViewA, subViewB, subViewC, subViewD ])
        expect(vc.length).to.equal(4)
        _.each(vc.views, function(view, cid) {
          expect(view.cid).to.equal(cid)
          foundCids[view.cid] = "found"
        })
        expect(foundCids[subViewA.cid]).to.equal("found")
        expect(foundCids[subViewB.cid]).to.equal("found")
        expect(foundCids[subViewC.cid]).to.equal("found")
        expect(foundCids[subViewD.cid]).to.equal("found")
      })
      it("should emit an attach event passing the [name, view] to the callback", function() {
        var vc,
          subView,
          attachedView,
          attachedViewName
        vc = new SubviewCollection(),
        subView = new View()
        attachedView = null
        attachedViewName = null
        vc.on('attach', function(name, view) {
          attachedView = view
          attachedViewName = name
        })
        vc.attach([ subView ])
        expect(attachedView).to.equal(subView)
        expect(attachedViewName).to.equal(subView.cid)
        vc = new SubviewCollection()
        subView = new View()
        vc.on('attach', function(name, view) {
          attachedView = view
          attachedViewName = name
        })
        vc.attach({
          'foo': subView
        })
        expect(attachedView).to.equal(subView)
        expect(attachedViewName).to.equal('foo')
      })
    })
    describe("SubviewCollection.prototype.detach", function() {
      it("Should decrement the view collections length attribute", function() {
        var vc = new SubviewCollection(),
          viewA = new View(),
          viewB = new View(),
          viewFoo = new View(),
          viewBar = new View()
        expect(vc.length).to.equal(0)
        vc.attach([ viewA, viewB ])
        expect(vc.length).to.equal(2)
        vc.attach({
          'foo': new View(),
          'bar': new View()
        })
        expect(vc.length).to.equal(4)
        vc.detach(viewA)
        vc.detach(viewB)
        expect(vc.length).to.equal(2)
        vc.detach('foo')
        vc.detach('bar')
        expect(vc.length).to.equal(0)
      })
      it("should take a cid and remove the view with the cid from the collection", function() {
        var vc = new SubviewCollection(),
          subViewA = new View(),
          subViewB = new View()
        vc.attach([ subViewA, subViewB ])
        expect(vc.views[subViewA.cid]).to.be.ok()
        expect(vc.views[subViewB.cid]).to.be.ok()
        expect(vc.length).to.equal(2)
        vc.detach(subViewB.cid)
        expect(vc.views[subViewB.cid]).to.not.be.ok()
        expect(vc.length).to.equal(1)
        vc.detach(subViewA.cid)
        expect(vc.views[subViewA.cid]).to.not.be.ok()
        expect(vc.length).to.equal(0)
      })
      it("should take a view instance and remove that view", function() {
        var vc = new SubviewCollection(),
          subViewA = new View(),
          subViewB = new View()
        vc.attach([ subViewA, subViewB ])
        expect(vc.views[subViewA.cid]).to.be.ok()
        expect(vc.views[subViewB.cid]).to.be.ok()
        expect(vc.length).to.equal(2)
        vc.detach(subViewB)
        expect(vc.views[subViewB.cid]).to.not.be.ok()
        expect(vc.length).to.equal(1)
        vc.detach(subViewA)
        expect(vc.views[subViewA.cid]).to.not.be.ok()
        expect(vc.length).to.equal(0)
      })
      it("should emit a detach event passing [name, view] to the callback", function() {
        var vc = new SubviewCollection(),
          subViewA = new View(),
          subViewFoo = new View(),
          cbsCalled = 0,
          detacheeName = null,
          detacheeView = null
        vc.attach([ subViewA ])
        vc.attach({
          'foo': subViewFoo
        })
        vc.on('detach', function(name, view) {
          cbsCalled++
          detacheeName = name
          detacheeView = view
        })
        expect(cbsCalled).to.equal(0)
        vc.detach(subViewA)
        expect(detacheeName).to.equal(subViewA.cid)
        expect(detacheeView).to.equal(subViewA)
        expect(cbsCalled).to.equal(1)
        vc.detach('foo')
        expect(detacheeName).to.equal('foo')
        expect(detacheeView).to.equal(subViewFoo)
        expect(cbsCalled).to.equal(2)
      })
    })
    describe("SubviewCollection.prototype.detachAll", function() {
      it("should remove all attached views", function() {
        var vc = new SubviewCollection()
        vc.attach([ new View(), new View(), new View(), new View() ])
        expect(vc.length).to.equal(4)
        vc.detachAll()
        expect(vc.length).to.equal(0)
        expect(vc.views).to.eql({})
        expect(Object.keys(vc.views).length).to.equal(0)
      })
    })
    describe("underscore collection methods", function() {
      it("should be present on SubviewCollection a array containing all methods", function() {
        expect(SubviewCollection.underscoreMethods).to.eql([
          "each","map","reduce","reduceRight","find","filter",
          "reject","all","any","include","invoke","pluck","max",
          "min","sortBy","groupBy","sortedIndex","shuffle","toArray","size"
        ])
      })
      it("should perform methods on the viewCollections views", function() {
        var vc = new SubviewCollection(),
          length,
          lastView
        vc.attach([ new View(), new View() ])
        length = 0
        expect(vc.size()).to.equal(2)
        vc.each(function(view) {
          length++
          expect(view).to.be.a(Backbone.View)
          lastView = view
        })
        expect(length).to.equal(2)
        expect(lastView).to.be.a(Backbone.View)
      })
    })
  })
})