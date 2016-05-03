---
title: "16.4 release notes"
description: We are happy to announce the release of SeedStack 16.4!
authors:
  - Adrien LAUER
date: 2016-04-28
slug: 16-4-release-notes
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 16.4, the first major release of 2016. Building on the recently introduced
add-on architecture, this releases brings several new components and features. A lot of improvements have also been done
under-the-hood to keep SeedStack up-to-date with current technologies and standards.

# New features

## Functional additions

* The new MQTT add-on provides an easy-to-use integration of the [MQTT communication protocol](http://mqtt.org/) through
the [Eclipse Paho](http://www.eclipse.org/paho/) library.
* A new [W20 theme for Angular-material](http://seedstack.org/themes/material/) has been contributed by [Jean-Baptise LENGLET](https://github.com/magador/).
Many thanks to him!

## Java

* Full support of Java 8 (along with an upgrade to Guice 4.0).
* Support of JAX-RS 2 asynchronous resources, enabling the building of reactive Web applications.
* Fully injectable and interceptable servlets, filters and listeners.
* Support for standard `@WebServlet`, `@WebFilter` and `@WebListener` annotations as well as programmatic registration.
* Automatic configuration of Logback when in use and no explicit configuration is present in the classpath.
* Best-effort detection of console color capabilities to enhance log readability.
* Ability to print a startup banner for applications by adding a `banner.txt` file in the default package.
* Support of Expression Language 3.
* Better Hypermedia support with completely automatic link creation.

## Business

* New methods `exists()`, `count()` and `clear()` on repositories with their default implementation in JPA and MongoDb.

## Web

* New visualization for huge data-sets based on [dygraphs](http://dygraphs.com/).
* Support for pretty URLs in W20 application with transparent backend support in W20 bridge (no configuration needed).
* Support for optional fragments which don't prevent application startup when not available.
* Best-effort cleanup of Basic Authentication credentials in browsers, allowing to effectively logout without closing the browser.

## MongoDb add-on

* Automatic support for Bean Validation at pre-persist when using Morphia.
* Automatic building of full-text indexes at startup.

# Fixes

A sizable amount of fixes have been applied to various modules. Please check the detailed change logs of each component
on [GitHub](https://github.com/seedstack), in their release section.

# Breaking changes

This version has only minor breaking changes that should not impact most projects. The most notable ones are:

* The dropping of Servlet 2.5 compatibility. SeedStack now requires a Servlet 3+ compliant server.
* The dropping of custom `@WebServlet` and `@WebFilter` annotations for the standard ones. Note that the standard annotation
`@WebListener` is also supported now.
* The `Comparable` interface on Business framework value objects has been removed and must be implemented by the project if
needed. This allows to implement a custom natural order on value objects.
* The `do*()` methods on Business framework `BaseRepository` have been removed. This only has an impact if you have
implemented repositories for custom persistence technologies (outside of JPA and MongoDb).

The detail of breaking changes is available in the detailed change logs of each component on [GitHub](https://github.com/seedstack),
in their release section.

# Component versions

Updated components are highlighted in **bold** characters (with a link to the detailed change log).

* poms: **[2.4.0](https://github.com/seedstack/poms/releases/tag/v2.4.0)**

## Core

* seed: **[2.3.0](https://github.com/seedstack/seed/releases/tag/v2.3.0)**
* business: **[2.3.0](https://github.com/seedstack/business/releases/tag/v2.3.0)**
* w20: **[2.3.0](https://github.com/seedstack/w20/releases/tag/v2.3.0)**

## Add-ons

* audit-addon: **[2.1.1](https://github.com/seedstack/audit-addon/releases/tag/v2.1.1)**
* elasticsearch-addon: **[2.1.1](https://github.com/seedstack/elasticsearch-addon/releases/tag/v2.1.1)**
* i18n-addon: **[2.2.1](https://github.com/seedstack/i18n-addon/releases/tag/v2.2.1)**
* io-addon: **[2.1.1](https://github.com/seedstack/io-addon/releases/tag/v2.1.1)**
* javamail-addon: **[2.1.1](https://github.com/seedstack/javamail-addon/releases/tag/v2.1.1)**
* jcache-addon: **[2.1.1](https://github.com/seedstack/jcache-addon/releases/tag/v2.1.1)**
* jdbc-addon: **[2.1.3](https://github.com/seedstack/jdbc-addon/releases/tag/v2.1.3)**
* jms-addon: **[2.1.2](https://github.com/seedstack/jms-addon/releases/tag/v2.1.2)**
* jpa-addon: **[2.1.3](https://github.com/seedstack/jpa-addon/releases/tag/v2.1.3)**
* ldap-addon: **[2.1.1](https://github.com/seedstack/ldap-addon/releases/tag/v2.1.1)**
* mongodb-addon: **[1.1.0](https://github.com/seedstack/mongodb-addon/releases/tag/v1.1.0)**
* monitoring-addon: **[2.1.1](https://github.com/seedstack/monitoring-addon/releases/tag/v2.1.1)**
* **mqtt-addon: [1.0.0](https://github.com/seedstack/mqtt-addon/releases/tag/v1.0.0)**
* neo4j-addon: **[1.0.2](https://github.com/seedstack/neo4j-addon/releases/tag/v1.0.2)**
* redis-addon: **[1.0.2](https://github.com/seedstack/redis-addon/releases/tag/v1.0.2)**
* scheduling-addon: **[2.1.1](https://github.com/seedstack/scheduling-addon/releases/tag/v2.1.1)**
* solr-addon: **[1.0.2](https://github.com/seedstack/solr-addon/releases/tag/v1.0.2)**
* spring-bridge-addon: **[2.2.1](https://github.com/seedstack/spring-bridge-addon/releases/tag/v2.2.1)**
* swagger-addon: **[1.0.1](https://github.com/seedstack/swagger-addon/releases/tag/v1.0.1)**
* validation-addon: **[2.3.0](https://github.com/seedstack/validation-addon/releases/tag/v2.3.0)**
* w20-bridge-addon: **[2.3.0](https://github.com/seedstack/w20-bridge-addon/releases/tag/v2.3.0)**
* web-services-addon: **[2.2.2](https://github.com/seedstack/web-services-addon/releases/tag/v2.2.2)**
* w20-extras: **[2.2.0](https://github.com/seedstack/w20-extras/releases/tag/v2.2.0)**
* w20-dataviz: **[2.2.0](https://github.com/seedstack/w20-dataviz/releases/tag/v2.2.0)**
* w20-material: **[2.1.5](https://github.com/seedstack/w20-material/releases/tag/v2.1.5)**
* w20-components: **[2.2.1](https://github.com/seedstack/w20-components/releases/tag/v2.2.1)**
* w20-bootstrap-3: **[2.2.0](https://github.com/seedstack/w20-bootstrap-3/releases/tag/v2.2.0)**
* w20-bootstrap-2: 2.1.2

## Themes

* w20-business-theme: **[1.2.0](https://github.com/seedstack/w20-business-theme/releases/tag/v1.2.0)**
* w20-simple-theme: **[3.2.0](https://github.com/seedstack/w20-simple-theme/releases/tag/v3.2.0)**
* **w20-material-theme: [1.0.0](https://github.com/seedstack/w20-material-theme/releases/tag/v1.0.0)**
