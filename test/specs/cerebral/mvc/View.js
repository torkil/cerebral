define([
  "backbone",
  "cerebral/mvc/View",
  "cerebral/mvc/ViewCollection"
], 
function(Backbone, View, ViewCollection) {  
  describe("cerebral/mvc/View", function() {
    describe("constructor", function() {
      it("instances should inherit from Backbone.View", function() {
        expect(new View()).to.be.a(Backbone.View)
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
  })
})