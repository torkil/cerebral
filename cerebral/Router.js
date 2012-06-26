
/**
  @class The base router class
  @exports cerebral/Router
  @extends Backbone.Router
  @requires [underscore, Backbone, cerebral/mvc/ViewCollection]
*/
define("cerebral/Router",[
  "backbone",
  "cerebral/mvc/ViewCollection"
], 
function( Backbone, ViewCollection ){

  /**
    Creates a new Router
    @public
    @constructor
    @property {cerebral/mvc/ViewCollection} delegateViews ViewCollection containing delegateViews. Link clicks inside delegateWiews will trigger navigate
  */
  var Router = Backbone.Router.extend({
    constructor: function() {
      this.delegateViews = new ViewCollection()
      this.delegateViews.on( "attach", this.onAttachedDelegateView, this )
      this.delegateViews.on( "detach", this.onDetachedDelegateView, this )
      Backbone.Router.prototype.constructor.apply( this, arguments )
    }
  })
  
  /**
    Checks a location object against a test url it follows the same-origin policy
    @public
    @static
    @type Function
    @param {Object|window.location} location The location object to check
    @param location.protocol
    @param location.port
    @param location.hostname
    @param {String} test The url to check
    @returns Boolean
  */
  Router.sameOrigin = function( location, test ) {
    var port, origin
    port = location.port && location.port != '80' ? ':' + location.port : ''
    origin = location.protocol + '//' + location.hostname + port
    return test.match( origin ) ? true : false
  }

  /**
    Takes a click event from a link. If its the same origin as the current url it lets it pass 
    else it prevents default and calls navigate
    @public
    @param {Object} event The click event
    @type Function
  */
  Router.prototype.clickListener = function( event ) {
    var url, path
    url = event.currentTarget.href
    if( !Router.sameOrigin(window.location, url) )
      return null
    event.preventDefault()
    path = event.currentTarget.pathname + event.currentTarget.search 
    this.navigate(path, {trigger: true})
  }

  /**
    Sets up the clickListener for all links inside the viewDelegate
    @public
    @type Function
    @event delegateViews#attach
    @param {String} name
    @param {Backbone.View|cerebral/mvc/view} viewDelegate
  */
  Router.prototype.onAttachedDelegateView = function( name, viewDelegate ) {
    viewDelegate.$el.delegate( "a", "click.router", _.bind(this.clickListener, this) )
    viewDelegate.on( "setelement", this.onDelegateViewSetElement, this )
  }

  /**
    Unbinds the clickListener from all links inside the view
    @public
    @type Function
    @event delegateViews#detach
    @param {String} name
    @param {Backbone.View|cerebral/mvc/view} viewDelegate
  */
  Router.prototype.onDetachedDelegateView = function( name, viewDelegate ) {
    viewDelegate.$el.undelegate( "a", "click.router" )
    viewDelegate.off( "setelement", this.onDelegateViewSetElement, this )
  }

  /**
    Rebinds the clickListener to all the links inside the viewDelegate on viewDelegate.setElement
    @public
    @type Function
    @event delegateViews#setelement
    @param {Backbone.View|cerebral/mvc/view} viewDelegate
  */
  Router.prototype.onDelegateViewSetElement = function( viewDelegate ) {
    viewDelegate.$el.delegate( "a", "click.router", _.bind(this.clickListener, this) )
  }

  return Router
})