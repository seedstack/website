---
title: "Running Web applications"
type: "home"
zones:
    - "Docs"
tags:
    - web
    - interfaces
menu:
    docs:
        weight: 1
        parent: "web"
---

The `seed-web-core` and its companion modules provide support for Web technologies, such as Servlets, WebSockets, embedded
Web servers, serving static resources, etc... <!--more-->

Web support requires the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-web-core" >}}

## Running Web applications

### With Undertow

By default, all SeedStack Web projects are running with the [Undertow](https://undertow.io) embedded Web server, using the
following dependency:

{{< dependency g="org.seedstack.seed" a="seed-web-undertow" >}}

This dependency provides a launcher that will handle the Undertow startup and shutdown logic. 

{{% callout ref %}}
Undertow-based Web applications are started and stopped as described in [this page](../running).
{{% /callout %}}        

### In a container

You can choose to run your Web application in an external Servlet 3+ container. In that case, the `seed-web-undertow` 
module must be removed (if present) and the application must be packaged as a WAR. 

{{% callout ref %}}
See [this guide](/guides/conversion-to-war) to learn how to convert an Undertow-based project to WAR.
{{% /callout %}}

