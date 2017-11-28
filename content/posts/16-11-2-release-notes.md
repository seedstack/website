---
title: "16.11.2 release notes"
description: We are happy to announce the release of SeedStack 16.11!
authors:
  - Adrien LAUER
date: 2016-07-29
slug: 16.11.2-release-notes
aliases: "/posts/16-11-2-release-notes"
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 16.11 «Kiwi». This is a major release bringing new exciting changes
such as a cleaner, much more powerful configuration system.<!--more-->

{{% callout info %}}
This post is about the revision 2 of SeedStack 16.11 which is the recommended version as the time of writing. There is 
no release note for 16.11 and 16.11.1 versions.
{{% /callout %}}

## W20

The JavaScript W20 framework is no longer a part of SeedStack itself and has been moved to its own [Github organization](https://github.com/w20-framework)
in which it will continue to evolve separately. This change makes of SeedStack, a full Java development solution. This 
separation greatly simplifies the evolution, the documentation and the "market positioning" of SeedStack and W20.

As before, you can still use the [W20 bridge add-on]({{<ref "addons/w20-bridge/index.md" >}}) to automate the integration
between SeedStack and W20.

{{% callout ref %}}
W20 document is now available on [https://w20-framework.github.io/](https://w20-framework.github.io/).
{{% /callout %}}

## New features

### Configuration system

As of version 16.11, SeedStack is changing from a basic key-value configuration system to something much more sophisticated
yet still simple to use. This new configuration system is internally named [Coffig](https://github.com/seedstack/coffig)
and is a flexible library that can be integrated with anything. 

It is multi-source (YAML, JSON, properties, environment variables, cloud configuration ...), each providing a part of 
a global configuration tree. This tree can then be mapped to any POJO either by a simple annotation or programmatically.

The most notable features are:

* Main configuration file named `application.yaml` at the root of the classpath,
* Hierarchical configuration structure,
* Flexible mapping, from a single property to complex objects graphs 
* Strongly typed mapping with built-in handling of many useful types: array, list, set, map, enum, optional, uri/url, 
properties, class
* Predictable overriding (for tests, from command-line, ...)
* Bean validation of configuration POJOs,
* Macros
* Complex functions 
* Profiles
* Automatic hiding of sensitive information (like password)

{{% callout ref %}}
More information [here]({{< ref "docs/core/configuration.md" >}}).
{{% /callout %}}

### Tooling support

SeedStack 16.11 adds support for tools that can be run on the project to execute a particular task. In tool mode, 
the application is initialized with the minimal amount of plugins necessary to execute the task but never fully started.
 
Tools can be run:

* With the [Maven plugin]({{< ref "docs/maven-plugin/index.md" >}}), either with the `tool` goal which can
run any tool by name or with a specific goal for simplicity.
* By executing the {{< java "org.seedstack.core.SeedMain" >}} class with the system property `seedstack.tool` set to the 
name of the tool to execute. 
 
The following tools are built-in in this version:

* `config` which describes all the configuration options of the application.
* `effective-config` which dumps the global configuration tree as resolved by the application (useful for debugging configuration issues).
* `crypt` which can crypt its arguments using the master key store configured in the application (useful for crypting passwords in configuration).
* `errors` which displays the catalog of error codes existing in the application.

### HTTP/HTTPS proxy support
 
JVM-wide HTTP and HTTPS proxy is now auto-configured from standard `http_proxy`, `https_proxy` and `no_proxy` environment 
variables. This behavior can be disabled in configuration where the proxy can be turned off or an explicit proxy can be
specified.

### Netflix add-on

A new add-on integrating some Netflix open-source technologies is now provided. It provides integration for the   
[Netflix Hystrix](https://github.com/Netflix/Hystrix) circuit-breaker and the [OpenFeign](https://github.com/OpenFeign/feign)
REST client.

{{% callout ref %}}
More information [here]({{< ref "addons/netflix/index.md" >}}).
{{% /callout %}}

### Bean validation

The bean validation integration is now part of SeedStack core and is always enabled as it is used by the configuration
system. Remove the add-on from your existing projects. Validation features are otherwise unchanged.

### Add-on archetype

A new archetype for creating add-ons from scratch is now provided in the distribution.

## Fixes

You can find about all fixes by checking the detailed change logs of each component on [GitHub](https://github.com/seedstack), 
in their release section. The versions of all components and the link to their changelog is available at the end of this
article. 

## Breaking changes

### Java 8

This version requires Java 8 as it uses Java 8 internally and some APIs include Java 8 features.

### Configuration changes

All SeedStack configuration options have been refactored to benefit of the new configuration features: hierarchical structure,
strong typing, validation, ... Prefixes have been removed in favor of shorter, simpler names, in camel case.
  
Configuration files from previous versions must be rewritten in YAML using new property names. While this can be a bit of
work, existing options still have the same semantic as before, making it easy to translate from old to new format.
    
You can use the documentation to learn about the new options and the `config` tool (see above) can be of great help to 
discover every option. New configuration is a lot more explicit and strongly typed so potential errors are easily diagnosed
and fixed.
 
### Jersey 1

Jersey 1 support has been removed. Only Jersey 2 which is a drop-in replacement for Jersey 1 is available.

### Module simplification

Some modules (`seed-transaction`, `seed-el` and `seed-crypto`) have been merged into the `seed-core` module. You must remove
those dependencies from your existing projects.
 
The `shell` and `metrics` modules have been separated as add-ons and are not part of the java framework anymore. They 
are unchanged feature-wise.

The data security feature has been also separated as an add-on. It is unchanged feature-wise. 

### Annotation detection

Annotation detection behavior on methods and classes has been standardized across the whole stack. A consistent detection 
behavior is now used everywhere:

* On methods and constructors:
  * The annotation is searched on the method/constructor with a fallback on its declaring class. 
  * If not found, every method/constructor overridden/implemented by it is searched with a fallback on its own declaring class.
* On classes, the annotation is searched on the class.

It is worth noting that:

* Superclasses are not searched but inheritable annotations will be found if present on a class up in the hierarchy.
* Meta-annotations (annotations annotated by the searched annotation) are always searched.

{{% callout warning %}}
This new unified behavior does not deviate a lot from previous version behaviors, but we still recommend that you check your
annotations, particularly for transaction management which have subtle semantics. 
{{% /callout %}}

### Utilities

The collection of various utilities previously located under the `org.seedstack.seed.core.utils` package have been rewritten
from scratch in a no-dependency utility library named [shed](https://github.com/seedstack/shed). This library includes
various pure-java utilities used throughout SeedStack. 

### Other breaking changes

Other minor breaking changes are listed in the changelog of each component. The versions of all components and the link 
to their changelog is available at the end of this article. 

## Component versions

### Poms

* poms: **[3.0.0](https://github.com/seedstack/poms/releases/tag/v3.0.0)**

### Core

* shed: **[1.0.1](https://github.com/seedstack/shed/releases/tag/v1.0.1)**
* coffig: **[2.0.0](https://github.com/seedstack/coffig/releases/tag/v2.0.0)**
* seed: **[3.1.0](https://github.com/seedstack/seed/releases/tag/v3.1.0)**
* business: **[3.0.1](https://github.com/seedstack/business/releases/tag/v3.0.1)**

### Add-ons

* audit-addon: **[3.0.0](https://github.com/seedstack/audit-addon/releases/tag/v3.0.0)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* elasticsearch-addon: **[3.0.0](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.0.0)**
* i18n-addon: **[3.0.0](https://github.com/seedstack/i18n-addon/releases/tag/v3.0.0)**
* io-addon: **[3.0.0](https://github.com/seedstack/io-addon/releases/tag/v3.0.0)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* jdbc-addon: **[3.0.0](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.0)**
* jms-addon: **[3.0.0](https://github.com/seedstack/jms-addon/releases/tag/v3.0.0)**
* jpa-addon: **[3.0.0](https://github.com/seedstack/jpa-addon/releases/tag/v3.0.0)**
* metrics-addon: [1.0.0](https://github.com/seedstack/metrics-addon/releases/tag/v1.0.0)
* netflix-addon: [1.0.0](https://github.com/seedstack/netflix-addon/releases/tag/v1.0.0)
* ldap-addon: **[3.0.0](https://github.com/seedstack/ldap-addon/releases/tag/v3.0.0)**
* mongodb-addon: **[2.0.0](https://github.com/seedstack/mongodb-addon/releases/tag/v2.0.0)**
* monitoring-addon: **[3.0.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.0.0)**
* mqtt-addon: **[2.0.0](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.0)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* redis-addon: **[2.0.0](https://github.com/seedstack/redis-addon/releases/tag/v2.0.0)**
* scheduling-addon: **[3.0.0](https://github.com/seedstack/scheduling-addon/releases/tag/v3.0.0)**
* shell-addon: **[1.0.0](https://github.com/seedstack/scheduling-addon/releases/tag/v1.0.0)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* spring-bridge-addon: **[3.0.1](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.0.1)**
* swagger-addon: **[2.0.0](https://github.com/seedstack/swagger-addon/releases/tag/v2.0.0)**
* w20-bridge-addon: **[3.0.0](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.0.0)**
* web-services-addon: **[3.0.0](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.0)**

