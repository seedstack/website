---
title: "15.11.1 release notes"
description: We are happy to announce the release of SeedStack 15.11.1!
authors:
  - Pierre THIROUIN
  - Adrien LAUER
date: 2016-01-22
slug: 15-11-1-release-notes
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 15.11.1, an incremental update of SeedStack 15.11.<!--more-->

# Changes

## Validation

The [validation add-on](http://seedstack.org/addons/validation) has been improved to better conform with the Bean
Validation specification. The custom `ValidationService` is deprecated and should be replaced by the class `Validator`
(which can be injected or obtained through the injectable `ValidatorFactory`).

## JDBC, JPA, JMS

Minor fixes of error messages which referenced outdated information.

## I18n

The [i18n add-on](http://seedstack.org/addons/i18n) performance has been vastly improved, both for translation initial
loading and during heavy use (better caching implementation). The translations of the add-on itself have been moved
to static files in its W20 frontend instead of being automatically populated backend keys. The CSV import throwing
exceptions has been fixed.

Beware that this version uses a different database mapping which is incompatible with tables from previous versions. The upgrade
procedure is:

* Export your keys and translations to a CSV file with your current version,
* Drop old i18n tables,
* Upgrade to the latest i18n version and let it recreate the tables,
* Import your keys and translation.

A detailed blog post will soon be published with the procedure details.

## W20 bridge

The [W20 bridge add-on](http://seedstack.org/addons/w20-bridge) contains minor fixes and the latest version of W20 and
it add-ons. The main evolution of W20 is the upgrade to AngularJS 1.4.8 and Bootstrap 3.3.6.

# New features

## Servlet 3.1: no more web.xml

Seed Web 2.2.0 comes with a support for [Servlet 3.1](https://java.net/downloads/servlet-spec/Final/servlet-3_1-final.pdf),
but Servlet 2.5 is still supported. If your servlet container supports servlet 3+, **remove all your `web.xml` files and
according tests configuration**.

        @Deployment
        public static WebArchive createDeployment() {
            return ShrinkWrap.create(WebArchive.class)
                       .setWebXML("WEB-INF/web.xml"); // TODO remove the web.xml configuration
        }

## JAX-RS 2

The version 2 of JAX-RS standard has been integrated in the Java framework through the Jersey 2 library. You can now
benefits of all the improvements of the JAX-RS 2 specification such as:

* Bean validation of parameters and return values,
* The ability to group parameters in reusable "BeanParam" classes,
* Asynchronous resources.

The JAX-RS 2 specification is backwards-compatible with JAX-RS 1 so you can easily upgrade by replacing your `seed-rest-jersey1`
dependency with `seed-rest-jersey2`. The configuration options are unchanged, except if you happened to have specified
custom Jersey properties. In that case, replace them with their [Jersey 2 equivalent](https://jersey.java.net/documentation/latest/appendix-properties.html).

## Swagger

A new [Swagger](http://swagger.io/) add-on has been released and can be used to expose JSON information about your
application API. This can be used by Swagger clients to display and document your REST API automatically. Some devices
(like API-management tools) can also autoconfigure themselves by using this Swagger description.

To enable the Swagger add-on, simply add it to your project dependencies:

{{< dependency g="org.seedstack.addons.swagger" a="swagger" >}}

The Swagger description will then be available on:

* `http://myserver.org/swagger.json` for the JSON format,
* `http://myserver.org/swagger.yaml` for the YAML format.

# Component versions

Updated components are highlighted in **bold** characters.

## Base

* poms: **[2.3.0](https://github.com/seedstack/poms/releases/tag/v2.3.0)**
* seed: **[2.2.0](https://github.com/seedstack/seed/releases/tag/v2.2.0)**
* business: **[2.2.0](https://github.com/seedstack/business/releases/tag/v2.2.0)**
* w20: **[2.2.0](https://github.com/seedstack/w20/releases/tag/v2.2.0)**

## Add-ons

* audit-addon: 2.1.0
* monitoring-addon: 2.1.0
* elasticsearch-addon: 2.1.0
* i18n-addon: **[2.2.0](https://github.com/seedstack/i18n-addon/releases/tag/v2.2.0)**
* io-addon: 2.1.0
* javamail-addon: 2.1.0
* jcache-addon: 2.1.0
* jdbc-addon: **[2.1.2](https://github.com/seedstack/jdbc-addon/releases/tag/v2.1.2)**
* jms-addon: **[2.1.1](https://github.com/seedstack/jms-addon/releases/tag/v2.1.1)**
* jpa-addon: **[2.1.2](https://github.com/seedstack/jpa-addon/releases/tag/v2.1.2)**
* ldap-addon: 2.1.0
* mongodb-addon: 1.0.0
* neo4j-addon: 1.0.0
* redis-addon: 1.0.0
* scheduling-addon: 2.1.0
* solr-addon: 1.0.0
* spring-bridge-addon: 2.2.0
* swagger-addon: **[1.0.0](https://github.com/seedstack/swagger-addon/releases/tag/v1.0.0)** (new)
* validation-addon: **[2.2.0](https://github.com/seedstack/validation-addon/releases/tag/v2.2.0)**
* w20-bridge-addon: **[2.2.0](https://github.com/seedstack/w20-bridge-addon/releases/tag/v2.2.0)**
* web-services-addon: 2.1.1
* w20-extras: **[2.1.1](https://github.com/seedstack/w20-extras/releases/tag/v2.1.1)**
* w20-dataviz: **[2.1.1](https://github.com/seedstack/w20-dataviz/releases/tag/v2.1.1)**
* w20-material: **[2.1.3](https://github.com/seedstack/w20-material/releases/tag/v2.1.3)**
* w20-components: **[2.2.0](https://github.com/seedstack/w20-components/releases/tag/v2.2.0)**
* w20-bootstrap-2: **[2.1.2](https://github.com/seedstack/w20-bootstrap-2/releases/tag/v2.1.2)**
* w20-bootstrap-3: **[2.1.2](https://github.com/seedstack/w20-bootstrap-3/releases/tag/v2.1.2)**

## Themes

* w20-simple-theme: **[3.1.1](https://github.com/seedstack/w20-simple-theme/releases/tag/v3.1.1)**
* w20-business-theme: **[1.1.3](https://github.com/seedstack/w20-business-theme/releases/tag/v1.1.3)**
