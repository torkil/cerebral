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