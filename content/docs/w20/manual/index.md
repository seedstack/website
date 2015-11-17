---
title: "Basics"
type: "home"
zones:
    - "W20"
sections:
    - "W20Manual"
menu:
    W20Manual:
        weight: 10
---

W20 Core provides the minimum requirements to run a W20 application, mainly: 

* An [AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition) infrastructure through [RequireJS](http://requirejs.org/),
* An MVC runtime through [AngularJS](https://angularjs.org/),
* Application loading and initialization,
* A permission model which enables to reflect backend security, 
* Extensive culture support.

No graphical framework is provided in this fragment so it can serve as a base to build your own or to implement a 
completely custom UI solution in a specific application. You may reserve this possibility for very specific purposes though,
since W20 provide a complete UI solution based on Bootstrap in the W20 UI fragment.

# Application loading

The `w20` module is the JS entry point of a W20 application. Its initialization sequence is as follow:
 
1. Loading and parsing of the application configuration,
2. Loading and parsing of all the required fragment manifests,
3. Computing of a global RequireJS configuration along with the list of all modules to load,
4. Loading of all modules needed at startup time at once,
5. Initializing of each loaded module through its lifecycle callbacks (pre -> run -> post). 

# AMD modules public interface
  
It is strongly recommended that you use anonymous AMD modules, each one living in its own JavaScript file. They have the 
following form:
 
    define([
        // list of the dependencies of this module
    ], function(/* list of injected dependencies in the same order*/) {
    
        // module factory function body (private scope of the module)
    
        return {
            // public signature of the module that can be injected 
            // when requested as a dependency of another module
        };
    });

## Lifecycle callbacks

To integrate a module into the lifecycle management of the application, you must add the following code to the public
signature of the module:

    return {
        ...
        
        lifecycle: {
            pre: function (modules, fragments, callback) {},
            run: function (modules, fragments, callback) {},
            post: function (modules, fragments, callback) {}
        }
        
        ...
    };
    
You can omit the unsupported callbacks (for instance, just leaving the pre one). If the loader recognize one or more
lifecycle callbacks, they will be invoked during W20 initialization with the following arguments:

* `modules` is an array of all public modules definitions,
* `fragments` an array of all loaded fragment manifests,
* `callback` is a callback that **MUST** be called to notify the loader that any processing in this phase is done for
this module (including asynchronous processing). If a module do not call its callback, the whole initialization process
is blocked for a specified amount of time. After that, it is cancelled and a timeout error message is displayed.
 
# AngularJS initialization

Before AngularJS initialization, it is guaranteed that:

* All AMD modules needed at startup are loaded, 
* Their factory functions have been run in the correct order,
* Their pre lifecycle callbacks have been run and all modules have notified the loader that they have finished loading
 their asynchronous resources if any.
  
AngularJS initialization is done explicitly with the `angular.bootstrap()` function on the document element. It occurs
in the run lifecycle callback of the `application` module. 

# AngularJS modules

For better modularity and code clarity, it is recommended to use [AngularJS modules](https://docs.angularjs.org/guide/module).
But to correctly initialize AngularJS, the `application` module must know all the full list of top-level declared
AngularJS modules. To expose them properly, you must add the following code to the public signature of AMD modules that
declare AngularJS modules:

    return {
        ...
        
        angularModules: [ 'angularModule1', 'angularModule2', ... ]
        
        ...
    };
    
All `angularModules` arrays of AMD public signature modules are concatenated and the resulting array is passed to 
the `angular.bootstrap()` function. Note that you don't need to add the transitive AngularJS modules.

# Routing

AngularJS provides powerful routing capabilities which consists in a matching between a portion of the window URL and 
a route definition. This route definition specifies the contents and behavior of the view that will be displayed inside the 
HTML tag containing the `ngView` attribute. To learn more about AngularJS routing, please check 
[this documentation](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider).

## Fragment-declared routes

Although the AngularJS programmatic way of defining the application routing can be used unaltered in any W20 application,
a simpler declarative way of defining the routing is available. It is done through the `routes` section of fragment
manifests:

    "routes": {
        "/route1": {
            ...
        },
        "/route2": {
            ...
        }
    }

The `application` module will process the `routes` section of all fragments and register the valid routes in the AngularJS
routing system. The two components of a W20 route definition are:

* The route paths which are specified by the keys of the `routes` object. To ensure route uniqueness in an application,
 the fragment identifier is used as a route path prefix. For example, if the fragment identifier is `fragment1` the full
 route path registered in AngularJS routing for `/route1` is `/fragment1/route1`. 
* The route definitions which are specified as an object for each route path.  

### Route types

A route definition should contain a `type` attribute. If it is not present, a route type of `view` is assumed which is
a standard AngularJS route. Two route types are available out-of-the-box:

* A `view` route is a standard AngularJS route, which is minimally processed by W20. If it contains a `templateUrl`, its
value is resolved into a full URL by the RequireJS function `toUrl()`. As such, every fragment alias (like `{fragment1}`)
is resolved.
* A `sandbox` route type is a W20-specific route type which encapsulate the page denoted by the `url` attribute into an
iframe. It is useful to add any pre-existing HTML pages into a W20 application such as legacy application screens. The
`url` attribute is resolved into a full URL by the RequireJS function `toUrl()`.

Any custom route type can be registered by using the `registerRouteHandler()` function of the `application` module public
definition:

    define([
        '{w20-core}/modules/application'
    ], function(application) {
        ...
        
        application.registerRouteHandler('myCustomType', function (route) {
            // analyze and transform the route object here        
        
            return route;
        });
        
        ...
    });
    
The handler will be invoked for each detected route of type `myCustomType`. It is required that the returned route
object is a valid AngularJS route definition.

## Additional route metadata

Additional attributes can be attached to route definition and will be ignored by AngularJS. When retrieving the route through
the AngularJS `$route` service, these attributes will be preserved, allow for further processing during the execution
of the application.

### W20 route metadata

W20 adds a limited set of attributes on all routes:

* `type`: the type attribute is automatically added if not present (with the `view` value),
* `path`: the full path of the route,
* `category`: the category of the route (which can be used to classify the routes for navigation) is added with a default value of `__top`. 
* `i18n`: the i18n key for the route name is added with a default value of `application.view.normalized.route.path`. Path
normalization consists of replacing slashes with dots. As such, the `/fragment1/route1` fragments will have a default i18n
key of `application.view.fragment1.route1`.
* `resolve`: a resolve object will be added to check for route security and for any additional custom check defined by the
`check` attribute on the route definition (which must reference by name a custom check function registered with AngularJS
injector through a `module.value('myCheck', function checkFn() { ... });` and returning a promise). The routing is suspended
until the promise is resolved (or rejected).

### Custom metadata

Any additional metadata can be added to the route for custom purposes, but be aware to not interfere with W20 route metadata
as any custom attribute of the same name will be overwritten before any custom route handler is called.


