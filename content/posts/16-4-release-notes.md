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
