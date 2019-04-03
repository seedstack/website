---
title: "Learn the basics"
type: "home"
zones:
    - "Docs"
sections:
    - "Manual"    
tags:
    - tutorial
menu:
    docs-manual:
        parent: "basics"
        weight: 2
---

**SeedStack is an opinionated, simple Java development stack.** It is a general purpose development solution but does
REST micro-services particularly well.<!--more-->

## Hello World

As the simplest example of a SeedStack application, the ancient tradition of the "Hello World" sample must be honored. 

You can find it in the `org.generated.project.interfaces.rest` package. The `HelloResource` class exposes a REST API
on `/hello` which returns the "Hello World!" text:

```java
package org.generated.project.interfaces.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

@Path("hello")
public class HelloResource {
    @GET
    public String hello() {
        return "Hello World!";
    }
}
``` 

## What's happening ?

At application startup, SeedStack scans the classpath **searching for specific code patterns it will recognize**. Which
patterns are recognized depends on which SeedStack modules are active in the application. 

As an example, the JAX-RS resource above is recognized by the `seed-rest-jersey2` module which automatically exposes it.

{{% callout info %}}
To be detected by the framework, **application code must be placed in a package that is scanned by SeedStack**. 
This is done in the `application.yaml` [YAML](https://en.wikipedia.org/wiki/YAML) configuration file, at the root of the 
classpath:

```yaml
application:
    basePackages: org.generated.project
```  
{{% /callout %}}

## Configuration

We already have seen a glimpse of the [SeedStack configuration system]({{< ref "docs/core/configuration.md" >}}). It is
a **global tree structure**, aggregated from several sources. The most important configuration source is the 
`application.yaml` file, located at the root of the classpath.

There are 3 special top-level nodes in the configuration tree:

* `env` contains all [environment variables]({{< ref "docs/core/configuration.md#environment-variables" >}}) as children nodes,
* `sys` contains all [Java system properties]({{< ref "docs/core/configuration.md#system-properties" >}}) as children nodes,
* `classes` can contain a hierarchy of nodes for [attaching metadata to classes]({{< ref "docs/core/configuration.md#class-configuration" >}}).

{{% callout info %}}
Besides these special nodes, each SeedStack module reserves a top-level node for its configuration. You can find
the name of those nodes in each module documentation. 
{{% /callout %}}

To access configuration, you have to [map]({{< ref "docs/core/configuration.md#mapping" >}}) a node in the tree to a Java object:

* Some types like primary types, arrays, lists, sets, etc... can be mapped directly.
* Other types are mapped by recursively matching their attributes to children tree nodes.

For example, write the following YAML in the `application.yaml` file:

```yaml
myConfig:
    names: ["Roger", "Anna"]
```  

Then create a simple `MyConfig` class in the `application` package:

```java
package org.generated.project.application;

import java.util.List;
import org.seedstack.coffig.Config;

@Config("myConfig")
public class MyConfig {
    private List<String> names;
    
    public List<String> getNames() {
        return names;
    }
}
``` 

{{% callout tips %}}
The {{< java "org.seedstack.coffig.Config" "@" >}} annotation correlates this class to the `myConfig` node in 
the tree.
{{% /callout %}}

Edit the `HelloResource` class to inject a fully mapped `MyConfig` POJO by using the 
{{< java "org.seedstack.seed.Configuration" "@" >}} annotation:

```java
package org.generated.project.interfaces.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import org.generated.project.application.MyConfig;
import org.seedstack.seed.Configuration;

@Path("hello")
public class HelloResource {
    @Configuration
    private MyConfig myConfig;

    @GET
    public String hello() {
        return "Hello " + myConfig.getNames().get(0) + "!";
    }
}
``` 

## Logging

SeedStack logging is based on the [SLF4J](https://www.slf4j.org/) logging facade. The recommended logging implementation
is [Logback](https://logback.qos.ch/). It is already present in the generated projects. 

A logger for the enclosing class can be injected with the {{< java "org.seedstack.seed.Logging" "@" >}} annotation. Edit 
the `HelloResource` class to inject a logger:

```java
package org.generated.project.interfaces.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import org.seedstack.seed.Logging;
import org.slf4j.Logger;

@Path("hello")
public class HelloResource {
    @Logging
    private Logger logger;

    @GET
    public String hello() {
        logger.info("The hello() method was called");
        return "Hello World!";
    }
}
``` 

## Now what ?

On this page you have learned:

* How a simple REST API can be exposed on an URL,
* How SeedStack configuration works,
* How to do logging.

### Troubleshooting

If you can't get this to work, check the [troubleshooting page]({{< ref "docs/basics/troubleshooting.md" >}}).

### Next step

If you want to learn more, continue on the tutorial to learn about [dependency injection]({{< ref "docs/basics/dependency-injection.md" >}}).
