---
title: "Static resources"
type: "home"
zones:
    - "Docs"
tags:
    - web
    - interfaces
menu:
    docs:
        weight: 11
        parent: "web"
---

SeedStack provides static resource serving from the classpath and the document root with some benefits over the container 
default resource serving:

* Automatic serving of pre-minified and/or pre-gzipped versions of resources,
* On-the-fly gzipping of resources,
* Cache friendly.

## Behavior

The behavior is to serve resources located under the document root folder and, if not found, under the `META-INF/resources` 
classpath location on the `/*` path. For example, consider the following folder tree:

    src/main/webapp
        index.html
        robots.txt
            
    META-INF
        resources
            robots.txt
            lib
                jquery.js
                jquery.min.js
                jquery.min.js.gz
                    
The default behavior is to serve index.html, robots.txt and jquery.js on the following paths:

    /robots.txt
    /index.html
    /lib/jquery.js
    
The jquery.js file will be served as a minified and gzipped version (without the overhead of on-the-fly gzipping since
a pre-gzipped version is already available). 

{{% callout info %}}
Static resource serving is enabled by default. Resources from document root are always served in priority over 
classpath resources.
{{% /callout %}}

## Configuration

{{% config p="web.static" %}}
```yaml
web:
  static:
    # If true, static resource serving is enabled
    enabled: (boolean)
    
    # If true, minification support is enabled, serving *.min files instead of regular ones if possible
    minification: (boolean)
    
    # If true, gzip support is enabled, serving *.gz files instead of regular ones if possible
    gzip: (boolean)       
     
    # If true, resources are gzipped on the fly, unless an already gzipped version (*.gz) exists
    gzipOnTheFly: (boolean)
    
    # The size of the buffer used for send static resource data
    bufferSize: (int)
``` 
{{% /config %}}

## MIME types

The following MIME types are automatically derived from extensions:

<table class="table table-striped">
<tr><th>Mime type</th><th>Extensions</th></tr>
<tr><td>text/html</td><td>html htm HTML HTM</td></tr>
<tr><td>text/plain</td><td>txt text TXT TEXT</td></tr>
<tr><td>text/javascript</td><td>js JS</td></tr>
<tr><td>text/css</td><td>css less CSS LESS</td></tr>
<tr><td>image/gif</td><td>gif GIF</td></tr>
<tr><td>image/jpeg</td><td>jpeg jpg jpe JPEG JPG JPE</td></tr>
<tr><td>image/png</td><td>png PNG</td></tr>
<tr><td>image/vnd.microsoft.icon</td><td>ico ICO</td></tr>
<tr><td>application/pdf</td><td>pdf PDF</td></tr>
<tr><td>application/json</td><td>json JSON</td></tr>
<tr><td>application/font-woff</td><td>woff WOFF</td></tr>
<tr><td>application/vnd.ms-fontobject</td><td>eot EOT</td></tr>
<tr><td>font/truetype</td><td>ttf TTF</td></tr>
<tr><td>font/opentype</td><td>otf OTF</td></tr>
</table>

## Caching

Resource lookup mechanism try to find resources in the following order:

1. Gzipped minified version, 
2. Gzipped version, 
3. Minified version,
4. Normal version.
   
Once a resource is found, its metadata (but not the contents) is cached to avoid unnecessary lookup. This cache can be
configured as below:

{{% config p="web.static.cache" %}}
```yaml
web:
    static:
        cache:
          # Maximum concurrent cache updates allowed
          concurrencyLevel: (int)
          
          # Maximum number of cache entries
          maxSize: (int)
          
          # Initial number of cache entries
          initialSize: (int)
```
{{% /config %}}
