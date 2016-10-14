---
title: "UI"
type: "home"
zones:
    - "W20"
sections:
    - "W20Manual"
tags:
    - "css"
    - "display"
    - "content"
    - "navigation"
    - "menu"
    - "bookmark"
menu:
    W20Manual:
        weight: 60
---

The user interface can be customized with the graphical framework of your choice along with services which helps in areas such as
navigation, display and theming.<!--more-->
 
# UI Framework

Application can use any CSS frameworks or your own custom styling. Two popular frameworks, [Twitter Bootstrap](http://getbootstrap.com/)
and [Angular Material](https://material.angularjs.org/latest/) are available through dedicated fragments. 
To include these framework in the application, declare the fragment that you want in your application manifest.

```
 "bower_components/w20-bootstrap-3/w20-bootstrap-3.w20.json": {}

 "bower_components/w20-material/w20-material.w20.json": {}
```

The CSS framework loaded can be identified in the application logic by requiring the `{css-framework}/modules/css-framework` module
and evaluating its `name` property.

```
define([
    '{css-framework}/modules/css-framework'
], function (cssFramework) {
    console.log(cssFramework.name); // "bootstrap-3"
});
```

# Services

Additionally, several services are available for different areas of the user interface.

## DisplayService

The `DisplayService` assists in presentation and positioning. It can request and exit fullscreen as well as registering callback
for dynamic CSS classes.

### Fullscreen mode

The `enterFullScreen()` and `exitFullScreen()` methods will request fullscreen mode according to the type of browser in use. Webkit browsers behave
differently from MS browsers for instance. These methods allows to abstract the request of the fullscreen mode for every browser.

### Dynamic positioning

The following CSS classes can have dynamic values:

 * `.w20-top-shift-padding` (padding-top)
 * `.w20-top-shift-margin` (margin-top)
 * `.w20-top-shift` (top)
 * `.w20-right-shift-padding` (padding-right)
 * `.w20-right-shift-margin` (margin-right)
 * `.w20-right-shift` (right)
 * `.w20-bottom-shift-padding` (padding-bottom)
 * `.w20-bottom-shift-margin` (margin-bottom)
 * `.w20-bottom-shift` (bottom)
 * `.w20-left-shift-padding` (padding-left)
 * `.w20-left-shift-margin` (margin-left)
 * `.w20-left-shift` (left)
 
 Whenever a `function () { return [ a, b, c, d ]; }` is registered through the `registerContentShiftCallback(fn)` method, the value of theses classes
 is summed with the value of a, b, c and d

 * a increment the value of `.w20-top-shift-padding`, `.w20-top-shift-margin`, `.w20-top-shift`
 * b increment the value of `.w20-right-shift-padding`, `.w20-right-shift-margin`, `.w20-right-shift`
 * c increment the value of `.w20-bottom-shift-padding`, `.w20-bottom-shift-margin`, `.w20-bottom-shift`
 * d increment the value of `.w20-left-shift-padding`, `.w20-left-shift-margin`, `.w20-left-shift`
 
 You can compute the "shift" in value by calling `computeContentShift()`. The `registerContentShiftCallback(fn)` will automatically call the `computeContentShift()`
 function but you might need to compute it again later if you used variables in the shift values for instance.
 
```
module.controller('ExempleController', ['DisplayService', 'EventService', 
function (displayService, eventService) {

    var show = true;
    
    function showElement () { 
        return [show ? 100 : 0, 50, 0, 0]; 
    }

    displayService.registerContentShiftCallback(showElement);
    
    eventService.on('SomeEvent', function() {
        show = !show;
        displayService.computeContentShift();
    });

}]);
```

In the example above, initially:

* The `.w20-top-shift-padding`, `.w20-top-shift-margin`, `.w20-top-shift` classes will have their value set to 100px.
* The `.w20-right-shift-padding`, `.w20-right-shift-margin`, `.w20-right-shift` classes will have their value set to 50px.
* the remaining one will have their value set to 0. 

When 'SomeEvent' happen, 

* The `.w20-top-shift-padding`, `.w20-top-shift-margin`, `.w20-top-shift` classes will have their value set to 0.
* The `.w20-right-shift-padding`, `.w20-right-shift-margin`, `.w20-right-shift` classes will have their value set to 50px.
* The remaining one will have their value set to 0.

## NavigationService

The `NavigationService` is mostly used internally to compute a hierarchical routes tree useful for displaying a menu of routes ordered
by categories. You can call the `routeTree` method to retrieve the routes tree of the application. For an exhaustive description of the API please
consult the JSdoc.

## MenuService

The MenuService enable user to register custom action and section in themes.

* "actions" are element of the topbar.
* "sections" are element of the sidebar.

Note that some themes only allow "actions".

### Registering actions/sections

Before an action or section is added it needs to be a member of an action type or section type. To register a 
new action/section type, use the `registerActionType(type, config)` or `registerSectionType(type, config)` methods of the service.

This is used to register the login and culture dropdown type action of themes for instance.

 ```
  menuService.registerActionType('w20-login', {
       templateUrl: '{css-framework}/templates/action-login.html',
       showFn: function () {
         return authenticationService.isAuthentifiable();
       }
   });

  menuService.registerActionType('w20-culture', {
       templateUrl: '{css-framework}/templates/action-culture.html',
       showFn: function () {
         return cultureService.availableCultures().length > 0;
       }
   });
```

The `showFn` property specify on which condition should the action/section be shown.

### Adding actions/sections

To actually include an action or section, use the `addAction('name', 'type', configExtension)` or `addSection('name', 'type', configExtension)` methods of the service.
```
menuService.addAction('login', 'w20-login', { sortKey: 100 });
```
The methods takes as argument the name of the action, the type of the action and a configuration object which extends
the registered type configuration. The `sortKey` property allow to order actions/sections.

## Bookmark service

The BookmarkService allow to store routes bookmarks. Use the `addBookmark(name, route)` method with a name and an angular route object to store one.
Use the `getBookmark(name)` or `getAllBookmarks()` methods to retrieve bookmarks. Additional methods are described in the API documentation.