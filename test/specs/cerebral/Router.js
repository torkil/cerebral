define("cerebral/Router",[
  "backbone"
], 
function( Backbone ){

  var Router = Backbone.Router.extend({
    constructor: function() {
      Backbone.Router.prototype.constructor.apply( this, arguments )
      if( typeof this.initialize === 'function' )
        this.initialize.apply(this, arguments)
    }
  })
    
  Router.prototype.viewDelegate = function(view) {
    view.$el
      .find('a')
      .live('click', _.bind(this.linkClick, this))
  }

  Router.prototype.extractPath = function(url) {
    var regex
    regex = /[\.no|1-9*]\/(.*)/
    url = regex.exec(url)
    return url[1] ? url[1] : ''
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
    messenger.publish('track:url', '/'+path)
  }

  Router.prototype.sameOrigin = function(href) {
    var port, origin
    port = location.port ? ':' + location.port : ''
    origin = location.protocol + '//' + location.hostname + port
    return href.match(origin) ? 1 : 0
  }

})