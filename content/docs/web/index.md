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

## External servlet container

You can choose to run your Web application in an external Servlet 3+ container like [Apache Tomcat](http://tomcat.apache.org/). 

{{% callout info %}}
To run in an external container, the `seed-web-undertow` dependency must be **NOT be present** in the classpath and the 
application must be [packaged as a WAR]({{< ref "guides/conversion-to-war/index.md" >}}).
{{% /callout %}}

## Undertow embedded server

SeedStack Web applications run well with the embedded [Undertow](https://undertow.io) Web server. To add support for 
Undertow in your application, add the following dependency:

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

### HTTPS

To configure Undertow for HTTPS, you need to have a Java keystore containing your server certificate. By default an SSL context
will be built using the `ssl` alias in the `master` keystore:

```yaml
crypto:
  keystores:
    master:
      path: path/to/your/keystore.jks
      password: keystorePassword
      aliases:
        ssl: aliasPassword
```

{{% callout info %}}
If you want to have alternative keystore or alias names, you can change them in the [global SSL configuration]({{< ref "docs/core/crypto.md#SSL" >}}).
{{% /callout %}}

After successful keystore configuration, you only need to enable HTTPS in the Undertow configuration:

```yaml
web:
  server:
    https: true
```

#### Mutual authentication

If you want to enable mutual authentication (where the HTTPS user-agent sends a client certificate), set `crypto.ssl.clientAuthMode`:

```yaml
crypto:
  ssl:
    clientAuthMode: REQUIRED
```

With that configuration, the user-agent will be required to send a client certificate for authentication.

## Runtime information

When running a Web application, servlet information is available in the `web.runtime` special configuration tree:

```yaml
web:
  runtime:
    # The context path of the servlet container
    contextPath: (String)
    
    # The virtual server name of the servlet container
    virtualServerName: (String)
```

When running with Undertow, additional information is also available:

```yaml
web:
  runtime:
    # The base url of the Web application (protocol + host + port + context path)
    baseUrl: (String)
    
    # The protocol used by the Web server
    protocol: (String)
    
    # The host used by the Web server
    host: (String)
    
    # The port used by the Web server
    port: (int)
```

{{% callout warning %}}
These values are not meant to be specified manually but are **provided** by SeedStack at runtime. 
{{% /callout %}}
