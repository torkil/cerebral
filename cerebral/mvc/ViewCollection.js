define([
  "underscore",
  "backbone"
], 
function(underscore, Backbone) {
  
  function ViewCollection(options) {
    underscore.extend(this, options)
  }

  ViewCollection.prototype.views = {}

  ViewCollection.prototype.length = 0

  ViewCollection.prototype.attach = function(subview) {
    if(!(subview instanceof Backbone.View))
      throw new TypeError('subview parameter not instance of Backbone.View')
    if(this.superview) {
      subview.superview = this.superview
    }
    this.views[subview.cid] = subview
    this.length++
  }

  function detachByInstance(view) {
    var i, test
    for (i = this.views.length - 1; i >= 0; i--) {
      test = this.views[i]
      if(view === test) {
        delete this.views[i]
        this.length--
        //TODO: emit detach 
      }
    }
  }

  function detachByCid(cid) {
    if(this.views[cid]) {
      delete this.views[cid]
      this.length--
      //TODO: emit detach
    } 
  }

  ViewCollection.prototype.detach = function(cidOrView) {
    if(typeof cidOrView === 'string') {
      detachByCid.call(this, cidOrView)
    }
    if(typeof cidOrView === 'object') {
      if(!(cidOrView instanceof Backbone.View))
        throw new TypeError('subview parameter not instance of Backbone.View')
      detachByInstance.call(this, cidOrView)
    }
  }

  return ViewCollection
})