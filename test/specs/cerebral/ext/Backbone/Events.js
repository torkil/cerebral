define([
  "cerebral/lib/Backbone"
], 
function( Backbone ) {  

  describe("cerebral/ext/Backbone/Events", function() {

    describe("Backbone.Events.bindTo", function() {

      var binder, target

      beforeEach(function() {
        binder = Object.create( Backbone.Events )
        target = Object.create( Backbone.Events )
      })

      it("should take [obj, eventname, callback] and fire the callback when the eventname fires on the given object", function() {
        var fired = false
        binder.bindTo(target, "change", function() {
          fired = true
        })
        expect(fired).not.to.be.ok()
        target.trigger("change")
        expect(fired).to.be.ok()
      })

      it("should bind the view as the this value of the callback", function() {
        var thisVal = null
        binder.bindTo(target, "change", function() {
          thisVal = this
        })
        expect(thisVal).not.to.be.ok()
        target.trigger("change")
        expect(thisVal).to.equal(binder)
      })

    })

    describe("Backbone.Events.bindToOnce", function() {

      var binder, target

      beforeEach(function() {
        binder = Object.create( Backbone.Events )
        target = Object.create( Backbone.Events )
      })

      it("should bind the event to fire on first firing then unbind it", function() {

        var fired = 0

        binder.bindToOnce(target, "change", function() {
          fired++
        })
        
        expect(fired).to.equal(0)

        target.trigger("change")

        expect(fired).to.equal(1)

        target.trigger("change")
        target.trigger("change")
        
        expect(fired).to.equal(1)        
      })

    })

    describe("Backbone.Events.unbindFrom", function() {

      var binder, objA, objB, triggered

      beforeEach(function() {
        triggered = 0
        binder = Object.create( Backbone.Events )
        objA = Object.create( Backbone.Events )
        objB = Object.create( Backbone.Events )
      })

      it("should unbind all listeners on a given object if only [object] given", function() {
        binder.bindTo(objA, "A", function() { triggered++ })
        binder.bindTo(objA, "B", function() { triggered++ })
        binder.bindTo(objB, "A", function() { triggered++ })
        binder.bindTo(objB, "B", function() { triggered++ })
        expect(triggered).to.equal(0)
        objA.trigger("A")
        objA.trigger("B")
        objB.trigger("A")
        objB.trigger("B")
        expect(triggered).to.equal(4)
        binder.unbindFrom(objA)
        objA.trigger("A")
        objA.trigger("B")
        objB.trigger("A")
        objB.trigger("B")
        expect(triggered).to.equal(6)
        binder.unbindFrom(objB)
        objA.trigger("A")
        objA.trigger("B")
        objB.trigger("A")
        objB.trigger("B")
        expect(triggered).to.equal(6)
      })

      it("should unbind all listeners with a given name on a given object if [object, event] is given", function() {
        binder.bindTo(objA, "A", function() { triggered++ })
        binder.bindTo(objA, "A", function() { triggered++ })
        binder.bindTo(objA, "B", function() { triggered++ })
        binder.bindTo(objA, "B", function() { triggered++ })
        expect(triggered).to.equal(0)
        objA.trigger("A")
        objA.trigger("B")
        expect(triggered).to.equal(4)
        binder.unbindFrom(objA, "A")
        objA.trigger("A")
        objA.trigger("B")
        expect(triggered).to.equal(6)
        binder.unbindFrom(objA, "B")
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
        binder.bindTo(objA, "A", incA)
        binder.bindTo(objA, "A", incB)
        binder.bindTo(objA, "A", incA)
        binder.bindTo(objA, "A", incB)
        expect(triggered).to.equal(0)
        objA.trigger("A")
        expect(triggered).to.equal(4)
        binder.unbindFrom(objA, "A", incA)
        objA.trigger("A")
        expect(triggered).to.equal(6)
        binder.unbindFrom(objA, "A", incB)
        objA.trigger("A")
        expect(triggered).to.equal(6)
      })

    })

    describe("Backbone.Events.unbindAll", function() {

      it("should remove all bound listeners", function() {
        var binder = Object.create( Backbone.Events ),
          obj = Object.create( Backbone.Events ),
          nrOfChangeFired = 0,
          nrOfUpdateFired = 0
        binder.bindTo(obj, "change", function() { nrOfChangeFired++ })
        binder.bindTo(obj, "update", function() { nrOfUpdateFired++ })
        expect(nrOfChangeFired).to.equal(0)
        expect(nrOfUpdateFired).to.equal(0)
        obj.trigger("change")
        obj.trigger("update")
        expect(nrOfChangeFired).to.equal(1)
        expect(nrOfUpdateFired).to.equal(1)
        binder.unbindAll()
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