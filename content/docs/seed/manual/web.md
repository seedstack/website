---
title: "Web"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
tags:
    - web
    - interfaces
menu:
    SeedManual:
        weight: 40
---

The `seed-web-core` and its companion modules provide support for Web technologies, such as Servlets, WebSockets, embedded
Web servers, serving static resources, etc... <!--more-->

# Dependency

Web support requires the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-web-core" >}}

# Running Web applications

## With Undertow

By default, all SeedStack Web projects are running with the [Undertow](https://undertow.io) embedded Web server, using the
following dependency:

{{< dependency g="org.seedstack.seed" a="seed-web-undertow" >}}

This dependency provides a launcher that will handle the Undertow startup and shutdown logic. 

{{% callout ref %}}
Undertow-based Web applications are started and stopped as described in [this page](../running).
{{% /callout %}}        

## In a container

You can choose to run your Web application in an external Servlet 3+ container. In that case, the `seed-web-undertow` 
module must be removed (if present) and the application must be packaged as a WAR. 

{{% callout ref %}}
See [this guide](/guides/conversion-to-war) to learn how to convert an Undertow-based project to WAR.
{{% /callout %}}

# Servlets, filters and listeners

Servlets, filters and listeners can be detected and registered by SeedStack which makes them injectable and interceptable.

You can register a servlet by annotating your servlet class with {{< java "javax.servlet.annotation.WebServlet" "@" >}}:

    @WebServlet("/myservlet/*")
    public class MyServlet extends HttpServlet {
        ...
    }
    
Similarly, you can register a filter by annotating your filter class with {{< java "javax.servlet.annotation.WebFilter" "@" >}}:

    @WebFilter("/myfilter/*")
    public class MyFilter implements Filter {
        ...
    }
    
Also, you can register a listener by annotating your listener class with {{< java "javax.servlet.annotation.WebListener" "@" >}}   

    @WebListener
    public class MyListener implements ServletContextListener {
        ...
    }
    
Any class annotated with WebListener must implement one or more of the {{< java "javax.servlet.ServletContextListener" >}}, 
{{< java "javax.servlet.ServletContextAttributeListener" >}}, {{< java "javax.servlet.ServletRequestListener" >}}, 
{{< java "javax.servlet.ServletRequestAttributeListener" >}}, {{< java "javax.servlet.http.HttpSessionListener" >}}, 
{{< java "javax.servlet.http.HttpSessionAttributeListener" >}} or {{< java "javax.servlet.http.HttpSessionIdListener" >}} interfaces.

{{% callout warning %}}
If you are running in a Web container also scanning those annotations, you need to disable the server detection to avoid 
getting an exception for duplicate registration.
{{% /callout %}}
    
# WebSockets

Seed also integrates the Java API for WebSocket (JSR 356), allowing server and client endpoints to be injected. WebSocket
support requires Java 7 and a compatible server to work.

## Server endpoints

No specific configuration is required for server endpoint. Just declare a standard JSR 356 endpoint:

    @ServerEndpoint(value = "/chat")
    public class ChatEndpoint {
    
        @Logging
        private Logger logger;
    
        @Inject
        EchoService echoService;
    
        @OnOpen
        public void onOpen(Session session) {
            logger.info("Connected ... " + session.getId());
        }
    
        @OnMessage
        public void message(String message, 
                            Session client) throws IOException, EncodeException {
            for (Session peer : client.getOpenSessions()) {
                peer.getBasicRemote().sendText(echoService.echo(message));
            }
        }
    
        @OnClose
        public void onClose(Session session, CloseReason closeReason) {
            logger.info(String.format("Session %s close because of %s", 
                session.getId(), closeReason));
        }
    
        @OnError
        public void onError(Session session, Throwable t) {
            logger.error(t.getMessage, t);
        }
        
    }

In this example, the endpoint receives a message and then broadcast it to all clients.

## Client endpoints

Unlike server endpoints, client endpoints have to explicitly specify a `SeedClientEndpointConfigurator` in order to be 
managed by Seed.

    @ClientEndpoint(configurator = SeedClientEndpointConfigurator.class)
    public class ChatClientEndpoint1 {
        public static final String TEXT = "Client1 joins";
        public static CountDownLatch latch;
        public static String response;
    
        @OnOpen
        public void onOpen(Session session) {
            try {
                session.getBasicRemote().sendText(TEXT);
            } catch (IOException ioe) {
                ioe.printStackTrace();
            }
        }
    
        @OnMessage
        public void processMessage(String message) {
            response = message;
            latch.countDown();
        }
    }

# Static resources

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

# CORS

Cross-Origin Resource Sharing (CORS) is supported through a Java filter and can be enabled in any Seed application.

{{% callout info %}}
Seed integrates the CORS filter from [dzhuvinov software](http://software.dzhuvinov.com/cors-filter.html). There is no 
need to install and configure the filter manually, it is automatically registered by Seed. All filter options can be 
specified through configuration properties.
{{% /callout %}}

## Configuration

CORS can be enabled and configuration as below:

{{% config p="web.cors" %}}
```yaml
web:
    cors:
      # The servlet path mapping on which CORS will be active
      path: (String)
     
      # If true, Cross-Origin-Resource-Sharing (CORS) will be enabled
      enabled: (boolean)
      
      # Allows to specify custom properties to the CORS filter
      properties: 
        key: (String)
```
{{% /config %}}

{{% callout ref %}}
CORS filters properties can be specified according to [its documentation](http://software.dzhuvinov.com/cors-filter-configuration.html#section-1),
but without the `cors.` prefix (e.g. `tagRequests`, `supportedMethods`, ...).
{{% /callout %}}

