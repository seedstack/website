---
title: "Samples"
type: "home"
zones:
    - "Docs"
tags:
    - tutorial
menu:
    docs:
        parent: "basics"
        weight: 98
---

Try out the samples below to learn what SeedStack is capable of.<!--more-->

Each sample is a Maven project that can be imported and launched in your favorite IDE.

## Download

{{% callout tips %}}
Each sample contains a `README.md` file describing how to build and launch it. 
{{% /callout %}} 

You can clone the `samples` git repository by running:
 
```sh
git clone https://github.com/seedstack/samples.git
```
## Basic samples

A lot of small samples, demonstrating basic SeedStack features:

* Business code,
* Command-line,  
* Configuration,
* Logging,
* Security,
* Diagnostic,
* Custom Guice module,
* Custom plugin,
* Command-line,
* JAX-RS resources,
* Web servlets, filters and listeners,
* WebSocket,
* Integration testing.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/basics
{{% /callout %}}

## Full applications

### Classic Web application

This sample demonstrates a full end-to-end Web application:

* Simple domain code,
* JPA persistence,
* REST resources,
* Assemblers,
* Pagination,
* Static resources serving,
* W20 UI.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/full-apps/store-webapp
<br>Relevant docs: [Business framework]({{< ref "docs/business/index.md" >}}), [JPA add-on]({{< ref "addons/jpa/index.md" >}}),
[JDBC add-on]({{< ref "addons/jdbc/index.md" >}}), [REST support]({{< ref "docs/web/rest.md" >}}),
[Web support]({{< ref "docs/web/index.md" >}}), [W20 UI framework](//w20-framework.github.io).
{{% /callout %}}

### REST micro-service

This sample demonstrates an hypermedia-capable REST micro-service:

* Business code
* JAX-RS resources,
* SeedStack hypermedia features: HAL and JSON-HOME.
* Integration testing.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/full-apps/catalog-microservice
<br>Relevant docs: [Business framework]({{< ref "docs/business/index.md" >}}), [REST support]({{< ref "docs/web/rest.md" >}}),
[Testing support]({{< ref "docs/core/testing.md" >}}).
{{% /callout %}}

### Domain-Driven Design

SeedStack implementation of DDD sample app (https://github.com/citerus/dddsample-core). This sample demonstrates how to write sophisticated business code, using the business framework.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/full-apps/ddd
<br>Relevant docs: [Business framework]({{< ref "docs/business/index.md" >}}).
{{% /callout %}}

## Add-on samples

### Web-Services add-on

This sample demonstrates JAX-WS integration:

* Basic Web-Service,
* Username token secured Web-Service,
* Certificate secured Web-Service,
* Client usage of those Web-Services.
 
{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/addons/web-services
<br>Relevant docs: [Web-Services add-on]({{< ref "addons/web-services/index.md" >}}).
{{% /callout %}}

### W20 bridge add-on

This sample demonstrates integration of the [W20 framework](//w20-framework.github.io):
 
* Usage of W20 JAR packaging,
* Custom W20 configuration handler,
* Basic W20 UI.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/addons/w20-bridge
<br>Relevant docs: [W20 bridge add-on]({{< ref "addons/w20-bridge/index.md" >}}).
{{% /callout %}}

### Spring bridge

This sample demonstrates the integration of Spring framework with SeedStack:

* Injection of SeedStack-managed instances in Spring beans,
* Injection of Spring beans in SeedStack-managed instances,
* Usage of SeedStack configuration values in Spring contexts,
* Usage of SeedStack datasources in Spring contexts.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/addons/spring-bridge
<br>Relevant docs: [Spring bridge]({{< ref "addons/spring-bridge/index.md" >}}).
{{% /callout %}}

### Spring Batch job

This sample demonstrates the integration of Spring framework and Spring batch with SeedStack:

* Running of Spring batch job with SeedStack.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/addons/spring-batch
<br>Relevant docs: [Spring bridge]({{< ref "addons/spring-bridge/index.md" >}}), [Command-line]({{< ref "docs/cli/index.md" >}}).
{{% /callout %}}

