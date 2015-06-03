---
title: "Configuration"
type: "addon"
zones:
    - "Addons"
sections:
    - "AddonsFunctions"
addons:
    - "W20 bridge"
menu:
    AddonsFunctionsW20:
        weight: 30
---

Several configuration options are possible to alter the W20 part of your application.

# Loading options

## Timeout

The W20 loader has a predefined time limit to load all the application assets. Although the default value of 30 seconds
should be enough for all applications, tt is sometimes desirable to increase it with the following option:

    org.seedstack.w20.timeout = 60

## CORS with credentials

To allow the application to access **secured** resources from other domains than its own, use the following option:

    org.seedstack.w20.cors-with-credentials = true

This option is not necessary when accessing its own resources or publicly accessible cross-origin resources only.

# Application options

## Masterpage template

The function uses a default html template for constructing the masterpage of the SPA. You can override this template by 
providing your own in the classpath and still benefit from the variables:

    org.seedstack.w20.masterpage-template = path/to/masterpage-template.html

Below is the default template used by the function. It uses variables and directives for themes. You may want to use it 
as a base for overriding. 

    <!doctype html>
    <html data-w20-app="${restPath}/seed-w20/application/configuration" data-w20-app-version="${applicationVersion}" data-w20-timeout="${timeout}" data-w20-cors-with-credentials="${corsWithCredentials}">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=Edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <title>${applicationTitle}</title>
        <script type="text/javascript" data-main="${componentsPath}/w20/core/modules/w20.js?__v=${applicationVersion}" src="${componentsPath}/requirejs/require.js?__v=${applicationVersion}"></script>
    </head>
    <body>
    <div id="w20-loading-cloak">
        <div class="w20-loading-indicator"></div>
    </div>
    <div data-w20-topbar data-title="'${applicationTitle}'" data-subtitle="'${applicationSubtitle}'"></div>
    <div data-w20-sidebar></div>
    <div id="w20-view" class="w20-content" data-ng-view></div>
    <div data-w20-error-report></div>
    </body>
    </html>
    
The available variables are:
    
* `applicationTitle`: value is coming from the `org.seedstack.w20.application.title` configuration property or the
   application 
* `applicationSubtitle`
* `applicationVersion`
* `timeout`
* `corsWithCredentials`
* `basePath`
* `restPath`
* `webResourcesPath`      

## Title

You can set the W20 application title with the following option:

    org.seedstack.w20.application.title = My application

The default value is set to the SEED application name (coming from the `org.seedstack.seed.core.application-name`).

## Subtitle

You can set the W20 application subtitle with the following option:

    org.seedstack.w20.application.subtitle = A great application

There is no default value.

## Version

You can set the W20 application version with the following option:

    org.seedstack.w20.application.version = 1.2.3

The version is treated as a string so there is no restriction format. The default value is set to the SEED application
version (coming from the `org.seedstack.seed.core.application-version`). It is not recommended to change this default
value, other than for testing purposes or special cases. The version string is appended to all assets URLs by the
W20 loader to ensure that resources are refreshed when the version change.
