cerebral.js [![Build Status](https://secure.travis-ci.org/gorillatron/cerebral.png?branch=master)](http://travis-ci.org/gorillatron/cerebral)
===========
***PREVIEW! many features not implemented***    

Bringing consciousness down the backbone.  
  
The cerebral framework is meant to extend the base functionality of Backbone.js and provide 
robust patterns of modularity, module loading and unloading and inter-module communication.    

It is loosely based on the concepts discussed in [Scalable Application Architecture](http://www.slideshare.net/nzakas/scalable-javascript-application-architecture by Nicholas Zakas) by Nicholas Zakas. and the [backbone-aura](https://github.com/addyosmani/backbone-aura) framework. Tip of the hat to [Addy Osmani](http://addyosmani.com/blog/).

## Overview

For more details se the (not yet created) *link to docs*

### Application Core

* Methods for publishing and subscribing to events. Used for inter module communication.

### Backbone extensions

Many of the Backbone classes are extended with features and functionality the programmers often have to write themselves or use plugins to use.

#### Events

* All event objects can bind to each other and properly remove bindings
* Added once for firing a handler once then unbinding

#### Model

* getters
* setters

#### View

* Attaching and detaching subviews
* Proper event handling and disposing, leave no zombie behind
* Disposing propegates down to all subviews

#### Router

* Attach and detach delegate views to pick up link clicks on.