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
        })
        .to.throwException(function(excpetion) {
          expect(excpetion).to.be.a(TypeError)
        })

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
        vc = new ViewCollection(),
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

        vc = new ViewCollection()
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

    describe("ViewCollection.prototype.detach", function() {

      it("Should decrement the view collections length attribute", function() {

        var vc = new ViewCollection(),
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

        var vc = new ViewCollection(),
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

        var vc = new ViewCollection(),
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

      it("should detach by instance even tough a name was specified and the cid wasnt used", function() {

        var vc = new ViewCollection(),
          foo = new View(),
          bar = new View()

        vc.attach({
          "foo": foo,
          "bar": bar
        })

        expect(vc.length).to.equal(2)

        vc.detach(foo)
        expect(vc.length).to.equal(1)

        vc.detach(bar)
        expect(vc.length).to.equal(0)

      })

      it("should emit a detach event passing [name, view] to the callback", function() {

        var vc = new ViewCollection(),
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

    describe("ViewCollection.prototype.detachAll", function() {

      it("should remove all attached views", function() {

        var vc = new ViewCollection()

        vc.attach([ new View(), new View(), new View(), new View() ])
        expect(vc.length).to.equal(4)
        
        vc.detachAll()
        expect(vc.length).to.equal(0)
        expect(vc.views).to.eql({})
        expect(Object.keys(vc.views).length).to.equal(0)
      })

    })

    describe("ViewCollection.prototype.subviewOnDispose", function() {

      it("should detach the view when the a view emits the dispose event", function() {

        var superView = new View(),
          subView = new View()

        superView.subviews.attach({ "subView": subView})
        expect(superView.subviews.views["subView"]).to.equal(subView)
        expect(superView.subviews.length).to.equal(1)
        
        subView.dispose()
        expect(superView.subviews.length).to.equal(0)
        expect(superView.subviews.views["subView"]).to.not.be.ok()

      })

    })

    describe("ViewCollection.prototype.get", function() {

      it("should return the view stored on the given key passed as parameter", function() {

        var viewCollection = new ViewCollection(),
          viewA = new View(),
          viewB = new View()

        viewCollection.attach({
          "viewA": viewA,
          "viewB": viewB
        })

        expect( viewCollection.get("viewA") ).to.equal( viewA )
        expect( viewCollection.get("viewB") ).to.equal( viewB )

      })

    })

    describe("ViewCollection.prototype.querySelector", function() {
      
      var ViewClass, viewCollection

      beforeEach(function() {

        ViewClass = View.extend({
          initialize: function( opts ) {
            _.extend( this, opts)
          },
          render: function() {
            this.$el.html( this.template )
          }
        })

        viewCollection = new ViewCollection()

        viewCollection.attach([
          new ViewClass({
            name: "span-a",
            template: " <span></span> <a></a> "
          }),
          new ViewClass({
            name: "span.sp-a.link",
            template: " <span class='sp'></span> <a class='link'></a> "
          }),
          new ViewClass({
            name: "span.sp.foo-a.link.lol",
            template: " <span class='sp foo'></span> <a class='link lol'></a> "
          })
        ])

        viewCollection.each(function( view ){
          view.render()
        })

      })

      it("should return an array of the views that has elements in its $el that match the selector", function() {
        
        var returned

        returned = viewCollection.querySelector( "span" )
        expect( returned.length ).to.equal( 3 )
        returned.forEach(function( view ) {
          expect( view ).to.be.a( ViewClass )
        })

        returned = viewCollection.querySelector( "span.sp" )
        expect( returned.length ).to.equal( 2 )

        returned = viewCollection.querySelector( "span.sp.foo" )
        expect( returned.length ).to.equal( 1 )

      })

    })

    describe("underscore collection methods", function() {

      it("should perform methods on the viewCollections views", function() {

        var vc = new ViewCollection(),
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