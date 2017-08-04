---
title: "17.4 release notes"
description: We are happy to announce the release of SeedStack 17.4!
authors:
  - Adrien LAUER
date: 2017-05-04
slug: 17.4-release-notes
aliases: "/posts/17-4-release-notes"
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 17.4 «Lotus». This is mostly a maintenance release but some new components
are provided.<!--more-->

# New features

## JMH add-on

A new add-on for writing benchmarks using [JMH](http://openjdk.java.net/projects/code-tools/jmh/) is provided. This add-on
provides several benefits for benchmarking SeedStack applications:
 
* Configuration of JHM using SeedStack configuration,
* Injection of benchmarks,
* A launcher is available for running benchmark as self-contained applications (like in a capsule).

## Seed initializers

Classes implementing {{< java "org.seedstack.seed.spi.SeedInitializer" >}} are invoked at SeedStack JVM-wide initialization, 
allowing to do early initialization (before kernel is started).
  
## Business fluent assembler
 
When merging lists of DTO to aggregates, the fluent assembler threw an exception if some aggregates where found in the
repository and some others were created with the factory. This is now controllable with an argument and mixed origins
are allowed by default.

# Fixes

## Tomcat + Logback error

In some runtime environments, using Tomcat with Logback auto-configuration lead to an exception. This has been fixed.
 
## Tomcat 8+ and external classpath directories

A change in the handling of external classpath locations in Tomcat starting with version 8 lead to scanning issues. Specifically
using a `<PreResources>` directory mounted on `WEB-INF/classes` configuration prevented SeedStack from scanning the 
`WEB-INF/classes` internal to the WAR. This is resolved.
  
## JMS refreshing of old connections

When using the automatic reconnection of JMS connections, the JMS add-on kept track of all past connections even closed ones,
not in use anymore. This lead to an overload of the JMS broker when a refresh occurred. This has been fixed and closed
connections are no longer tracked.

## Other fixes

You can find about all other fixes by checking the detailed change logs of each component on [GitHub](https://github.com/seedstack), 
in their release section. The versions of all components and the link to their changelog is available at the end of this
article. 

# Changes

## Configuration with properties

Previously, properties files were mapped by the configuration system as flat keys, ignoring the dot as a nesting separator.
This has changes and properties files are mapped in-depth. This is more intuitive and allows properties files to work
seamlessly with other formats like YAML. 

One important side-effect is that you cannot give a value to a property (`test`) already used as a prefix of another 
property (`test.subProperty`). This is also the reason why system properties are still mapped as flat keys as they do 
not satisfy this constraint (for instance `java.vendor` and `java.vendor.url` both have a value).

## Feign add-on

Feign no longer being part of Netflix components, a specific add-on has been created for it.

# Component versions

## General

* poms: **[3.0.1](https://github.com/seedstack/poms/releases/tag/v3.0.1)**
* seedstack-maven-plugin: **[2.4.3](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.4.3)**

## Core

* shed: **[1.0.2](https://github.com/seedstack/shed/releases/tag/v1.0.2)**
* coffig: **[2.1.0](https://github.com/seedstack/coffig/releases/tag/v2.1.0)**
* seed: **[3.2.0](https://github.com/seedstack/seed/releases/tag/v3.2.0)**
* business: **[3.1.0](https://github.com/seedstack/business/releases/tag/v3.1.0)**

## Add-ons

* audit-addon: **[3.0.0](https://github.com/seedstack/audit-addon/releases/tag/v3.0.0)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* elasticsearch-addon: **[3.0.0](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.0.0)**
* feign-addon: **[1.0.0](https://github.com/seedstack/feign-addon/releases/tag/v1.0.0)**
* i18n-addon: **[3.0.0](https://github.com/seedstack/i18n-addon/releases/tag/v3.0.0)**
* io-addon: **[3.0.0](https://github.com/seedstack/io-addon/releases/tag/v3.0.0)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* jdbc-addon: **[3.0.1](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.1)**
* jmh-addon: **[1.0.1](https://github.com/seedstack/jmh-addon/releases/tag/v1.0.1)**
* jms-addon: **[3.0.1](https://github.com/seedstack/jms-addon/releases/tag/v3.0.1)**
* jpa-addon: **[3.0.1](https://github.com/seedstack/jpa-addon/releases/tag/v3.0.1)**
* metrics-addon: [1.0.0](https://github.com/seedstack/metrics-addon/releases/tag/v1.0.0)
* ldap-addon: **[3.0.0](https://github.com/seedstack/ldap-addon/releases/tag/v3.0.0)**
* mongodb-addon: **[2.0.0](https://github.com/seedstack/mongodb-addon/releases/tag/v2.0.0)**
* monitoring-addon: **[3.1.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.1.0)**
* mqtt-addon: **[2.0.1](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.1)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* netflix-addon: **[1.0.1](https://github.com/seedstack/netflix-addon/releases/tag/v1.0.1)**
* redis-addon: **[2.0.0](https://github.com/seedstack/redis-addon/releases/tag/v2.0.0)**
* scheduling-addon: **[3.0.0](https://github.com/seedstack/scheduling-addon/releases/tag/v3.0.0)**
* shell-addon: **[1.0.0](https://github.com/seedstack/scheduling-addon/releases/tag/v1.0.0)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* spring-bridge-addon: **[3.1.0](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.0)**
* swagger-addon: **[2.0.0](https://github.com/seedstack/swagger-addon/releases/tag/v2.0.0)**
* w20-bridge-addon: **[3.0.1](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.0.1)**
* web-services-addon: **[3.0.0](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.0)**
