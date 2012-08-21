define([
  "underscore",
  "backbone",
  "cerebral/mvc/View",
  "cerebral/mvc/ViewCollection"
], 
function( _, Backbone, View, ViewCollection) {  

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

    // describe("View.extend", function() {

    //   it("should set properties from the mixin on the view", function() {

    //     var fired = {
    //       'parent clickHandler': 0,
    //       'parent keyupHandler': 0,
    //       'parent keydownHandler': 0,
    //       'child hoverHandler': 0,
    //       'child keydownHandler': 0
    //     }

    //     var Parent = View.extend({
    //       events: {
    //         'click': 'clickHandler',
    //         'keyup': 'keyupHandler',
    //         'keydown': 'keydownHandler'
    //       },
    //       clickHandler : function() { fired['parent clickHandler']++ },
    //       keyupHandler : function() { fired['parent keyupHandler']++ },
    //       keydownHandler: function() { fired['parent keydownHandler']++ }
    //     })

    //     var Child = Parent.extend({
    //       events: _.extend(Parent.prototype.events, {
    //         'keyup': 'keyupHandler'
    //       }),
    //       keyupHandler : function() { return fired['child keyupHandler']++ },
    //       keydownHandler: function() { return fired['child keydownHandler']++ }
    //     })

    //     var parent = new Parent()
    //     var child = new Child()

    //     parent.$el.trigger( 'click' )
    //     parent.$el.trigger( 'keyup' )
    //     parent.$el.trigger( 'keydown' )

    //     expect( fired['parent clickHandler'] ).to.equal( 1 )
    //     expect( fired['parent keyupHandler'] ).to.equal( 1 )
    //     expect( fired['parent keydownHandler'] ).to.equal( 1 )

    //     child.$el.trigger( 'click' )
    //     expect( fired['parent clickHandler'] ).to.equal( 2 )

    //   })

    // })

    describe("View.prototype.dispose", function() {

      it("should emit a dispose event, passing the view itself as parameter", function() {

        var view = new View()
        var disposedView = null
        view.on("dispose", function(view) {
          disposedView = view
        })
        expect(disposedView).not.to.be.ok()
        view.dispose()
        expect(disposedView).to.equal(view)

      })

    })

     describe("View.prototype.setElement", function() {

      it("should emit a 'setelement' event", function() {

        var i = 0
        var view = new View()
        view.on('setelement', function() {
          i++
        })
        view.setElement( $('<span></span>') )
        view.setElement( $('<div></div>') )
        expect( i ).to.equal( 2 )
        
      })

     })

  })
  
})