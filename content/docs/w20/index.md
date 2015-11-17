---
title: "Introduction"
type: "home"
zones:
    - "W20"
sections:
    - "W20Introduction"
menu:
    W20Introduction:
        weight: 10
---

W20 is a web solution designed to allow developers to quickly and simply create enterprise-grade **Single Page
Application** (SPA). It is **server agnostic** which means it can work with any HTTP capable server technology. In fact,
it can even work without any server.

# Benefits

W20 provides a **modular programming model for web applications**, allowing entire parts of web frontend to be reused
across applications. These parts are called fragments and can be published on any HTTP server as static resources.
Creating a frontend application with W20 becomes as easy as choosing the fragments you want to load and how you want 
them to be configured from a single configuration file.
In fact, W20 itself is distributed as several fragments which are, aside from its core, all optional.


# Organization of an application

A W20 application is a Single Page Application (SPA) composed of:

* A **master page** (usually `index.html`, but can be dynamically generated). It is the entry point of the application.
* A **configuration file** (usually `w20.app.json`, but can be dynamically generated).
* One or more **fragment(s)**. A fragment is a bundle of web resources described by a JSON manifest which must be 
accessible by HTTP from the browser.

```
    (docroot)
        |-index.html
        |-w20.app.json
        |-fragments
            |-fragment1
                |-fragment1.w20.json
                ...
            |-fragment2
                |-fragment2.w20.json
                ...
            ...
```

## The master page

A single page application is a web application that fits on a single web page called the master page (usually 
`index.html`). Assuming you keep your static resources in a `bower_components` directory, a sample code of a 
minimalist master page in W20 would be :

    <!doctype html>
    <html data-w20-app>
    <head>
        <title>Application title</title>
        <script type="text/javascript" 
                data-main="bower_components/w20/modules/w20" 
                src="bower_components/requirejs/require.js">
        </script>
    </head>

    <body>
        <div data-ng-view></div>
    </body>
    </html>

**Things worth noticing :**

* The `data-w20-app` attribute on the `html` tag that will load the configuration of your W20 application.
* The `<script>` tag, where we reference [RequireJS](http://requirejs.org/) and instruct it to load W20.
* A W20 application is also an [AngularJS](http://angularjs.org) application. Therefore you should add a `<div>` tag 
with the `data-ng-view` attribute. This will include rendered templates into the master page.

## The configuration file

The configuration file `w20.app.json` is where you set-up your application. As mentioned earlier, a W20 application is 
basically composed of a set of fragments (a fragment is a bundle of web resources). All are optional except one : the
core fragment of W20, thus it has to be referenced in the `w20.app.json`. This is done by specifying the path to its 
configuration file (_a.k.a_ the fragment manifest) :

    "bower_components/w20/w20-core.w20.json": {}

## The fragments

An important concept in W20 is the **fragment**. A W20 application is composed of one or more fragment(s). A fragment is 
a bundle of web resources (templates, css, javascript, ...). Each one is intended to serve a purpose and **can be reused 
across applications**. For example, W20 provides an optional fragment with native AngularJS implementations of UI 
components such as _datagrid_ and _combo boxes_.

### Fragment manifest

To reference web resources and how they are to be configured, each fragment has its own manifest file located at the 
root of the fragment. The only mandatory property is the fragment unique identifier :

    {
        "id" : "fragment-identifier"
    }

By convention, the manifest file is called after the fragment identifier and suffixed by `.w20.json`. In this example, 
the fragment manifest would be `fragment-identifier.w20.json`.
 
### Fragment modules

Now suppose we want to use the fragment discussed above but only the _datagrid_ component. For that, W20 offers a finer 
granularity to configure your application. Within a single fragment, there can be several units called **modules** which
are loaded only if you decide to reference them in your application configuration. That way, you can load a fragment 
without being forced to load all of its resources.
The sample code below shows how to declare a fragment module :

    {
        "id" : "fragment-identifier",
        
        "modules": {
            "module1": {
                "path": "{fragment-identifier}/modules/module1",
                "autoload" : true|false,
                "configSchema": {
                    ...
                }
            }
        }
    }
    
**Things worth noticing :**

* `{fragment-identifier}` is used by W20 as a placeholder to target the fragment path. This ensures paths are always 
relative to the fragment manifest location. It is particularly useful if the fragment is intended to be used across 
applications
* The `path` attribute is mandatory for RequireJS to load the module when it is required by the application
* Fragments modules are [AMD compliant](http://requirejs.org/docs/whyamd.html#amd)
* If a configuration JSON schema is provided for a specific module in the fragment manifest, the configuration specified
here will be validated against it.

# How it works

The master page is the one and only entry point of your web application. By adding the following `<script>` tag in it, 
two things happen :

1. RequireJS is loaded
2. Once RequireJS is loaded, it loads `bower_components/w20/modules/w20.js` (notice there is no extension in the 
`<script>` when pointing to the `w20.js` :

    ```
        <script type="text/javascript" 
                data-main="bower_components/w20/modules/w20" 
                src="bower_components/requirejs/require.js">
        </script>
    ```
    
3. `w20.js` is the core implementation of W20. Once loaded, it will automatically parse your application configuration 
file `w20.app.json` to :

    * detect which fragments to load
    * detect which modules to load for each fragment
    * validate configuration for each fragment and module (`w20.app.json`) against its schema 
    (`fragment-identifier.w20.json`)
    * load AMD modules using RequireJS
    * load the home view from the application module of the W20 core fragment into the master page

# Start a new project

Thanks to the W20 application generator provided by Seedstack, you can have a running web application in minutes. 
The following steps will guide you through the process :

1. Install [Node.js](https://nodejs.org) which bundles [npm](https://www.npmjs.com/)
2. Install [Yeoman](http://yeoman.io/), [Bower](http://bower.io/), [Grunt](http://gruntjs.com/) globally using npm :

    ` npm install -g yo bower grunt-cli`
    
3. Install the generator-w20 :

    `npm install -g generator-w20`
    
4. Create a directory for your project, cd into it and launch the generator with Yeoman :

    `yo w20`
    
5. Choose among W20 optional fragments which ones you want to use

6. Run your static server with Grunt :

    `grunt connect`
    
7. Open your application in a web browser and that's it !

<div class="pull-right margin-top-20">
    <a href="manual" class="btn btn-u">Next: start reading the manual</a>
</div>
<div class="clearfix"></div>