define([
  "backbone",
  "cerebral/mvc/View",
  "cerebral/mvc/ViewCollection"
], 
function(Backbone, View, ViewCollection) {  

  describe("cerebral/mvc/View", function() {

    describe("constructor", function() {

      it("should call View.prototype.constructor and initialize once", function() {
        var ctorCalled = 0
        var ViewClass = View.extend({
          initialize: function() { 
            ctorCalled++
          }
        })
        var vc = new ViewClass()
        expect(ctorCalled).to.equal(1)
      })

      it("instances should inherit from Backbone.View", function() {
        expect( new View() ).to.be.a(Backbone.View)
        expect( new View().cid ).to.be.ok()
      })

      it("should set attribute subviews of type ViewCollection on the created instance", function() {
        var vc = new View()
        expect(vc.subviews).to.be.ok()
        expect(vc.subviews).to.be.a(ViewCollection)
      })

      it('should call the supplied initialize function in the constructor', function() {
        var ViewClass = View.extend({
          initialize: function() { 
            this.initializeed = true
          }
        })
        var vc = new ViewClass()
        expect(vc.initializeed).to.equal(true)
      })

      it("should set subview even if initialize is overidden", function() {
        var ViewClass = View.extend({
          initialize: function() { 
            this.initializeed = true
          }
        })
        var vc = new ViewClass()
        expect(vc.subviews).to.be.ok()
        expect(vc.subviews).to.be.a(ViewCollection)
      })

    })

    describe("View.prototype.bindTo", function() {

      it("should take [obj, eventname, callback] and fire the callback when the eventname fires on the given object", function() {
        var view = new View(),
          obj = new Backbone.Model(),
          fired = false
        view.bindTo(obj, "change", function() {
          fired = true
        })
        expect(fired).not.to.be.ok()
        obj.trigger("change")
        expect(fired).to.be.ok()
      })

      it("should bind the view as the this value of the callback", function() {
        var view = new View(),
          obj = new Backbone.Model(),
          thisVal = null
        view.bindTo(obj, "change", function() {
          thisVal = this
        })
        expect(thisVal).not.to.be.ok()
        obj.trigger("change")
        expect(thisVal).to.equal(view)
      })

    })

    describe("View.prototype.unbindFrom", function() {

      var view, objA, objB, triggered

      beforeEach(function() {
        triggered = 0
        view = new View()
        objA = new Backbone.Model()
        objB = new Backbone.Model()
      })

      it("should unbind all listeners on a given object if only [object] given", function() {
        view.bindTo(objA, "A", function() { triggered++ })
        view.bindTo(objA, "B", function() { triggered++ })
        view.bindTo(objB, "A", function() { triggered++ })
        view.bindTo(objB, "B", function() { triggered++ })
        expect(triggered).to.equal(0)
        objA.trigger("A")
        objA.trigger("B")
        objB.trigger("A")
        objB.trigger("B")
        expect(triggered).to.equal(4)
        view.unbindFrom(objA)
        objA.trigger("A")
        objA.trigger("B")
        objB.trigger("A")
        objB.trigger("B")
        expect(triggered).to.equal(6)
        view.unbindFrom(objB)
        objA.trigger("A")
        objA.trigger("B")
        objB.trigger("A")
        objB.trigger("B")
        expect(triggered).to.equal(6)
      })

      it("should unbind all listeners with a given name on a given object if [object, event] is given", function() {
        view.bindTo(objA, "A", function() { triggered++ })
        view.bindTo(objA, "A", function() { triggered++ })
        view.bindTo(objA, "B", function() { triggered++ })
        view.bindTo(objA, "B", function() { triggered++ })
        expect(triggered).to.equal(0)
        objA.trigger("A")
        objA.trigger("B")
        expect(triggered).to.equal(4)
        view.unbindFrom(objA, "A")
        objA.trigger("A")
        objA.trigger("B")
        expect(triggered).to.equal(6)
        view.unbindFrom(objA, "B")
        objA.trigger("A")
        objA.trigger("B")
        expect(triggered).to.equal(6)
      })

      it("should unbind only a singel listener if [object, event, callback] is given", function() {
        function incA() {
          triggered++ 
        }
        function incB() {
          triggered++ 
        }
        view.bindTo(objA, "A", incA)
        view.bindTo(objA, "A", incB)
        view.bindTo(objA, "A", incA)
        view.bindTo(objA, "A", incB)
        expect(triggered).to.equal(0)
        objA.trigger("A")
        expect(triggered).to.equal(4)
        view.unbindFrom(objA, "A", incA)
        objA.trigger("A")
        expect(triggered).to.equal(6)
        view.unbindFrom(objA, "A", incB)
        objA.trigger("A")
        expect(triggered).to.equal(6)
      })

    })

    describe("View.prototype.unbindAll", function() {

      it("should remove all bound listeners", function() {
        var view = new View(),
          obj = new Backbone.Model(),
          nrOfChangeFired = 0,
          nrOfUpdateFired = 0
        view.bindTo(obj, "change", function() { nrOfChangeFired++ })
        view.bindTo(obj, "update", function() { nrOfUpdateFired++ })
        expect(nrOfChangeFired).to.equal(0)
        expect(nrOfUpdateFired).to.equal(0)
        obj.trigger("change")
        obj.trigger("update")
        expect(nrOfChangeFired).to.equal(1)
        expect(nrOfUpdateFired).to.equal(1)
        view.unbindAll()
        obj.trigger("change")
        obj.trigger("update")
        expect(nrOfChangeFired).to.equal(1)
        expect(nrOfUpdateFired).to.equal(1)
      })

    })

    describe("View.prototype.dispose", function() {

      it("should emit a dispose event, passing the view itself as parameter", function() {
        var view = new View(),
          disposedView = null
        view.on("dispose", function(view) {
          disposedView = view
        })
        expect(disposedView).not.to.be.ok()
        view.dispose()
        expect(disposedView).to.equal(view)
      })

    })

  })
  
})