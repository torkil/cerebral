define("cerebral/Router",[
  "backbone",
  "cerebral/mvc/ViewCollection"
], 
function( Backbone, ViewCollection ){

  var Router = Backbone.Router.extend({
    constructor: function() {
      this.delegateViews = new ViewCollection()
      this.delegateViews.on( "attach", this.onAttachedDelegateView, this )
      this.delegateViews.on( "detach", this.onDetachedDelegateView, this )
      Backbone.Router.prototype.constructor.apply( this, arguments )
    }
  })
  
  Router.extractPath = function(event) {
    var regex
    regex = /[\.no|1-9*]\/(.*)/
    url = regex.exec(url)
    return url[1] ? url[1] : ''
  }

  Router.prototype.clickListener = function( event ) {
    
  }

  Router.prototype.onAttachedDelegateView = function( view ) {
    view.$el.delegate( "a", "click.router", _.bind(this.clickListener, this) )
    view.on( "setelement", this.onDelegateViewSetElement, this )
  }

  Router.prototype.onDetachedDelegateView = function( view ) {
    view.$el.undelegate( "a", "click.router" )
  }

  Router.prototype.onDelegateViewSetElement = function( view ) {
    view.$el.delegate( "a", "click.router", _.bind(this.clickListener, this) )
  }

  Router.prototype.linkClick = function(event) {
    var url, path
    url = event.currentTarget.href
    if(!this.sameOrigin(url)) {
      return null
    }
    event.preventDefault()
    path = this.extractPath(url)
    this.navigate(path, {trigger: true})
  }

  Router.prototype.sameOrigin = function(href) {
    var port, origin
    port = location.port ? ':' + location.port : ''
    origin = location.protocol + '//' + location.hostname + port
    return href.match(origin) ? 1 : 0
  }

  return Router
})