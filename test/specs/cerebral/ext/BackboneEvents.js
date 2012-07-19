define([
  "backbone",
  "cerebral/mvc/View",
  "cerebral/mvc/ViewCollection"
], 
function(Backbone, View, ViewCollection) {  

  describe("cerebral/ext/BackboneEvents", function() {

    describe("Backbone.Events.bindTo", function() {

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

    describe("Backbone.Events.unbindFrom", function() {

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

    describe("Backbone.Events.unbindAll", function() {

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

    describe("Backbone.Events.once", function() {

      it("should fire the callback one then unbind it from firing again", function() {

        var i = 0
        var j = 0
        var incrementI = function() { i++ }
        var incrementJ = function() { j++ }
        var emitter = Object.create( Backbone.Events )
        emitter.once('incrementI', incrementI)
        emitter.once('incrementJ', incrementJ)
        emitter.trigger('incrementI')
        expect( i ).to.equal( 1 )
        emitter.trigger('incrementI')
        expect( i ).to.equal( 1 )
        emitter.trigger('incrementJ')
        expect( j ).to.equal( 1 )
        emitter.trigger('incrementJ')
        expect( j ).to.equal( 1 )
      })

      it("should set the this context by the third parameter", function() {

        var context = { foo: 'bar' }
        var emitter = Object.create( Backbone.Events )
        var that = null
        emitter.once('foo', function() {
          that = this
        }, context)
        emitter.trigger( 'foo' )
        expect( that ).to.equal( context )

      })

    })

  })
  
})