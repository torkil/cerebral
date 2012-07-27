
/**
  @class The base router class
  @exports cerebral/Router
  @extends Backbone.Router
  @requires [underscore, cerebral/lib/Backbone, cerebral/mvc/ViewCollection]
*/
define(
"cerebral/application/Router", [
  "cerebral/lib/Backbone",
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
      Backbone.Router.prototype.constructor.apply( this, arguments )
      this.oid = Router.generateObjectId()
      this.delegateViews = new ViewCollection()
      this.bindTo( this.delegateViews, "attach", this.onAttachedDelegateView, this )
      this.bindTo( this.delegateViews, "detach", this.onDetachedDelegateView, this )
    }
  })

  /*
    Internal incremented id to be assigned to new routers
    @private
    @type Number
  */
  var _oid = 0

  /**
    Returnes a unique number to be used as object id for new routers
    @public
    @static
    @type Function
    @returns Number
  */
  Router.generateObjectId = function() {
    _oid = _oid + 1
    return _oid
  }
  
  /**
    Checks a location object against a test url it follows the same-origin policy
    @public
    @static
    @type Function
    @param {Object|window.location} location The location object to check
    @param {String} location.protocol
    @param {Number} location.port
    @param {String} location.hostname
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
    viewDelegate.$el.delegate( "a", this.generateClickEventName(), _.bind(this.clickListener, this) )
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
    viewDelegate.$el.undelegate( "a", this.generateClickEventName() )
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
    viewDelegate.$el.delegate( "a", this.generateClickEventName(), _.bind(this.clickListener, this) )
  }

  /**
    Generates a namespaced click listener string for binding and unbinding click events to delegateViews
    @public
    @type Function
    @returns String
  */
  Router.prototype.generateClickEventName = function() {
    return "click.router#" + this.oid
  }

  return Router
})