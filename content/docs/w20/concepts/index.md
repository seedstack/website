---
title: "Masterpage"
type: "home"
zones:
    - "W20"
sections:
    - "W20Concepts"
menu:
    W20Concepts:
        weight: 10
---

The masterpage is the only entry point of a W20 application. It is the only full page served when a user access the
application. Its responsibility is to load W20 with a `<script>` tag and to define the application top-level layout. 
A minimal master page can be like the following:

    <!doctype html>
    <html data-w20-app>
    <head>
        <title>Application title</title>
        <script type="text/javascript" 
                data-main="bower_components/w20/core/modules/w20" 
                src="bower_components/requirejs/require.js">
        </script>
    </head>

    <body>
        <div data-ng-view></div>
    </body>
    </html>

# Head

Two things are required to load a W20 application:

* a `<script>` tag to load RequireJS and specify the w20 module as the main module, 
* a `data-w20-app` attribute on the `html` tag.

Any other tag can be added in the head but be aware that due to the asynchronous nature of W20 initialization the loading 
order between masterpage-loaded and RequireJS-loaded resources is undefined. To be on the safe side, rely on the RequireJS loader to load any of the application dependencies.

# Body

As a W20 application is also an [AngularJS](http://angularjs.org) application, so you should add a `<div>` tag with the `data-ng-view` attribute to display the AngularJS current view contents. If you need any additional markup in the body, feel free to add it. As this is a Single Page Application, all tags defined in the body are present on all application pages.
