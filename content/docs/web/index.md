---
title: "Running Web applications"
type: "home"
zones:
    - "Docs"
tags:
    - web
    - interfaces
aliases: /docs/seed/manual/web    
menu:
    docs:
        weight: 1
        parent: "web"
---

The `seed-web-core` and its companion modules provide support for Web technologies, such as Servlets, WebSockets, embedded
Web servers, serving static resources, etc... <!--more-->

A SeedStack Web application requires the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-web-core" >}}

## With Undertow embedded server

SeedStack Web applications run well with the embedded [Undertow](https://undertow.io) Web server. 

To add support for Undertow in your application, add the following dependency:

{{< dependency g="org.seedstack.seed" a="seed-web-undertow" >}}

{{% callout info %}}
This dependency provides a {{< java "org.seedstack.seed.spi.SeedLauncher" >}} implementation that handles the creation, 
configuration, startup and shutdown of the server. 

An application configured with the Undertow Web server can be [packaged as a capsule]({{< ref "docs/maven-plugin/package.md" >}}) 
that can be [run directly as an executable JAR]({{< ref "docs/core/index.md" >}}).  
{{% /callout %}}


### Configuration

The embedded server can be configured with the following options:

{{% config p="web.server" %}}
```yaml
web:
  server:
    # The host on which the server will be listening (0.0.0.0 by default)
    host: (String)
    
    # The port on which the server will be listening (8080 by default)
    port: (int)
    
    # The base context path of the application (/ by default)
    contextPath: (String)
    
    # If true, HTTP/2 will be enabled (true by default)
    http2: (boolean)
    
    # If true, HTTPS will be enabled (false by default)
    https: (boolean)
    
    # The welcome files served by default by the server (index.html by default)
    welcomeFiles: (List<String>)
    
    # The part below is specific to the Undertow implementation
    undertow:
      # The size of Undertow buffers
      bufferSize: (Integer)
      
      # The number of Undertow I/O threads
      ioThreads: (Integer)
      
      # The number of Undertow worker threads
      workerThreads: (Integer)
      
      # If true, direct buffers are used
      directBuffers: (Boolean)
```
{{% /config %}}  

## In an external container

You can choose to run your Web application in an external Servlet 3+ container. 

{{% callout info %}}
To run in an external container, the `seed-web-undertow` dependency must be **NOT be present** in the classpath and the 
application must be [packaged as a WAR]({{< ref "guides/conversion-to-war/index.md" >}}).
{{% /callout %}}
