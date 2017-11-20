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
        weight: 8
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

Go into the cloned repository and initialize all submodules to the tip of their master branch and checkout it with the following commands:

```sh
cd samples
git submodule update --remote --recursive --init && git submodule foreach --recursive git checkout master
```

## Full Web application

This sample demonstrates a full end-to-end Web application:

* Simple domain code,
* JPA persistence,
* REST resources,
* Assemblers,
* Pagination,
* Static resources serving,
* W20 UI.

{{% callout ref %}}
GitHub: https://github.com/seedstack/store-webapp-sample/tree/master
<br>Relevant docs: [Business framework]({{< ref "docs/business/index.md" >}}), [JPA add-on]({{< ref "addons/jpa/index.md" >}}),
[JDBC add-on]({{< ref "addons/jdbc/index.md" >}}), [REST support]({{< ref "docs/web/rest.md" >}}),
[Web support]({{< ref "docs/web/index.md" >}}), [W20 UI framework](//w20-framework.github.io).
{{% /callout %}}

## REST micro-service

This sample demonstrates an hypermedia-capable REST micro-service:

* Business code
* JAX-RS resources,
* SeedStack hypermedia features: HAL and JSON-HOME.
* Integration testing.

{{% callout ref %}}
GitHub: https://github.com/seedstack/catalog-microservice-sample/tree/master
<br>Relevant docs: [Business framework]({{< ref "docs/business/index.md" >}}), [REST support]({{< ref "docs/web/rest.md" >}}),
[Testing support]({{< ref "docs/basics/testing.md" >}}).
{{% /callout %}}

## Business code

This sample demonstrates basic business code written with the business framework:

* A few aggregates,
* A policy,
* An in-memory repository,
* Integration testing.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/business
<br>Relevant docs: [Business framework]({{< ref "docs/business/index.md" >}}), [Testing support]({{< ref "docs/basics/testing.md" >}}).
{{% /callout %}}

## Java framework basics

This samples demonstrates a set of features available in the Java framework:
  
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
GitHub: https://github.com/seedstack/samples/tree/master/seed
{{% /callout %}}

## Command-line

This sample demonstrates how to write a command-line handler:

* Command-definition,
* Option and argument injection.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/cli
<br>Relevant docs: [Command-line]({{< ref "docs/core/cli.md" >}}).
{{% /callout %}}

## Web-Services

This sample demonstrates JAX-WS integration:

* Basic Web-Service,
* Username token secured Web-Service,
* Certificate secured Web-Service,
* Client usage of those Web-Services.
 
{{% callout ref %}}
GitHub: https://github.com/seedstack/web-services-sample/tree/master
<br>Relevant docs: [Web-Services add-on]({{< ref "addons/web-services/index.md" >}}).
{{% /callout %}}

## W20 bridge

This sample demonstrates integration of the [W20 framework](//w20-framework.github.io):
 
* Usage of W20 JAR packaging,
* Custom W20 configuration handler,
* Basic W20 UI.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/w20-bridge
<br>Relevant docs: [W20 bridge add-on]({{< ref "addons/w20-bridge/index.md" >}}).
{{% /callout %}}

## Spring bridge

This sample demonstrates the integration of Spring framework with SeedStack:

* Injection of SeedStack-managed instances in Spring beans,
* Injection of Spring beans in SeedStack-managed instances,
* Usage of SeedStack configuration values in Spring contexts,
* Usage of SeedStack datasources in Spring contexts.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/spring-bridge
<br>Relevant docs: [Spring bridge]({{< ref "addons/spring-bridge/index.md" >}}).
{{% /callout %}}

## Batch job

This sample demonstrates the integration of Spring framework and Spring batch with SeedStack:

* Running of Spring batch job with SeedStack.

{{% callout ref %}}
GitHub: https://github.com/seedstack/samples/tree/master/batch
<br>Relevant docs: [Spring bridge]({{< ref "addons/spring-bridge/index.md" >}}), [Command-line]({{< ref "docs/core/cli.md" >}}).
{{% /callout %}}
