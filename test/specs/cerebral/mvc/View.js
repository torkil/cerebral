define([
  "cerebral/mvc/View"
], function(View) {
  
  describe('cerebral/mvc/View', function() {
    it('inherits from Backbone.View', function() {
      expect(new View).to.be.a(Backbone.View)
    })
  })

})