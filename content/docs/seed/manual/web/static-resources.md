---
title: "Static resources"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedWeb"
tags:
    - "web"
    - "resources"
    - "static"
    - "configuration"
    - "mime-type"
    - "servlet"
menu:
    SeedWeb:
        weight: 30
---

Seed web support provides automatic static resource serving from the classpath and the docroot with some benefits
over the container default resource serving:

* Automatic serving of pre-minified and/or pre-gzipped versions of resources
* On-the-fly gzipping of resources
* Cache friendly
* Emulation of servlet 3.0 serving from classpath when not available

# Default behavior

The default behavior is to serve resources located under the "/resources" docroot folder and, if not found, under the
"META-INF/resources/resources" classpath location on the "/resources/*" path. For example, consider the following folder tree:

    docroot/
        resources/
            index.html
            robots.txt
            
    META-INF/
        resources/
            resources/
                robots.txt
                lib/
                    jquery.js
                    jquery.min.js
                    jquery.min.js.gz
                    
The default behavior is to serve index.html, robots.txt and jquery.js on the following paths:

    /resources/robots.txt
    /resources/index.html
    /resources/lib/jquery.js
    
The jquery.js file will be served as a minified and gzipped version (without the overhead of on-the-fly gzipping since
a pre-gzipped version is already available). If a file under docroot leads to the same resulting path as in Classpath, 
then the docroot file have priority (consider robots.txt in above example). **Docroot resources always have precedence over Classpath resources.**

# Serving path

The default serving path can be altered. For example:
    
    org.seedstack.seed.web.resources.path = /my-custom-resource-path

The serving paths then are updated by appending `/my-custom-resource-path` to the docroot base path and the META-INF/resources
classpath location thus serving from respective folloing paths:

* `docroot/my-custom-resource-path` for docroot based resources
* `META-INF/resources/my-custom-resource-path` for classpath based resources

Note that specifying an empty resource path would mean that resources are served directly under the application context root.
In that case the webapp must be dedicated to serving web resources since it will not be able to register additional
servlets (`/*` will be reserved for web resources).


# Minification and gzip support

The file extension is determined from the requested URL as the characters' sequence after the last dot `.` of the hierarchical part. For instance `js` extension would be retrieved from: 

    http://myapplication/resources/lib/jquery.js

If minification support is enabled and a file with a `min.` prefixed extension is found, then it is used instead of the originally requested file
In below example, the last file would be served:
    
    /resources/lib/jquery.js
    /resources/lib/jquery.min.js

If gzip support is enabled and the browser accepts gzip encoding and a file with a `.gzip` suffixed extension is found, 
then it is used instead of the originally requested file (or instead of the minified file determined in the previous step):

* For instance, in below example, the last file would be served:
```
/resources/lib/jquery.js
/resources/lib/jquery.min.js
/resources/lib/jquery.js.gzip
```

* If no gzipped version has been found but on-the-fly gzip support is enabled, the resource will be gzipped in-memory for serving.

To control the minification and gzip behavior, use the following properties:

    org.seedstack.seed.web.resources.minification-support = true | false
    org.seedstack.seed.web.resources.gzip-support = true | false
    org.seedstack.seed.web.resources.gzip-on-the-fly = true | false


# MIME types

The following MIME types are automatically matched from extensions:

* text/html				            <==>    html htm HTML HTM
* text/plain				        <==>    txt text TXT TEXT
* text/javascript                   <==>    js JS
* text/css                          <==>    css less CSS LESS
* image/gif				            <==>    gif GIF
* image/jpeg				        <==>    jpeg jpg jpe JPEG JPG JPE
* image/png                         <==>    png PNG
* image/vnd.microsoft.icon          <==>    ico ICO
* application/pdf                   <==>    pdf PDF
* application/json                  <==>    json JSON
* application/font-woff             <==>    woff WOFF
* application/vnd.ms-fontobject     <==>    eot EOT
* font/truetype                     <==>    ttf TTF
* font/opentype                     <==>    otf OTF

# Caching

Resource information is determined by calls to classloader `getResource()` for classpath locations and by calls to
`File.canRead()` for docroot locations. The number of these calls per resource lookup can increase when:

* Using multiple locations (classpath or docroot based), in which case the lookup logic is invoked for each location.
* Using minification and gzip support, in which case the lookup logic itself is more costly trying to find
  the resource in the following order : 
```  
gzipped minified version 
gzipped version 
minified version 
normal version    
```

A built-in cache is used to improve the lookup performance of resources that were served at least one time. You can
alter the cache properties as follows (below example with default values):

    org.seedstack.seed.web.resources.cache.max-size = 8192
    org.seedstack.seed.web.resources.cache.concurrency = 32
    org.seedstack.seed.web.resources.cache.initial-size = 2048

If you don't specify the initial-size configuration property, it will be set at max-size / 4.