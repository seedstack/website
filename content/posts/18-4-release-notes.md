---
title: "18.4 release notes"
description: We are happy to announce the release of SeedStack 18.4!
authors:
  - Adrien LAUER
date: 2018-05-07
slug: 18.4-release-notes
aliases: "/posts/18-4-release-notes"
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 18.4 «Orchid». 

## New features

### Java 9 compatibility

SeedStack only requires Java 8 to work but is now compatible with Java 9. Applications should require no workaround to 
run on Java 9.

### Servlet 4.0

Web applications built on SeedStack can take advantage of Servlet 4.0 features, provided that the server supports it,
like the provided embedded server, Undertow. 

### Integration testing

Coming soon...

### OAuth add-on

A [new OAuth add-on](/addons/oauth) provides support for the OAuth 2.0 and OpenID Connect protocols. This enables applications
to authenticate and authorize users using any compliant provider. Authorization-only (without authentication) is possible
if your provider doesn't support OpenID Connect.  

### CRUD add-on

A [new CRUD add-on](/addons/crud) can automatically provide a full CRUD REST API for any DTO, provided that
you used the business framework to write it. You can choose between: 

* Applying a single annotation on the DTO and let the add-on provide the full API,
* Write your own REST resource class that reuse add-on functionality and enrich it.

## Fixes

This version contains minor fixes in various components, please check individual component change logs for details.

## Changes

### Integration testing

Coming soon...

### W20 bridge

The [W20-bridge CRUD add-on](/addons/w20-bridge) is now based on the most recent version of the W20 framework which 
has switched from Bower to NPM for package management. 

As a result, Web packages are now located under a `node_modules` location instead of a `bower_components` one. Some 
packages also have a slightly updated name (when the NPM package had a different name from the Bower one).

{{% callout info %}}
All W20 components take this location change into account but **you will also have to update your W20 frontend explicit dependencies.** 
{{% /callout %}}

## Component versions

### General

* seedstack-maven-plugin: **[2.7.0](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.7.0)**

### Core

* [chg] shed: **[1.1.3](https://github.com/seedstack/shed/releases/tag/v1.1.3)**
* [chg] coffig: **[3.1.0](https://github.com/seedstack/coffig/releases/tag/v3.1.0)**
* [chg] seed: **[3.6.0](https://github.com/seedstack/seed/releases/tag/v3.6.0)**
* [chg] business: **[4.2.1](https://github.com/seedstack/business/releases/tag/v4.2.1)**

### Add-ons

* audit-addon: **[3.0.0](https://github.com/seedstack/audit-addon/releases/tag/v3.0.0)**
* aws-addon: **[1.0.0](https://github.com/seedstack/aws-addon/releases/tag/v1.0.0)**
* [chg] cci-addon: **[1.1.0](https://github.com/seedstack/cci-addon/releases/tag/v1.1.0)**
* consul-addon: **[1.0.0](https://github.com/seedstack/consul-addon/releases/tag/v1.0.0)**
* [new] crud-addon: **[1.0.0](https://github.com/seedstack/crud-addon/releases/tag/v1.0.0)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* elasticsearch-addon: **[3.0.0](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.0.0)**
* [chg] feign-addon: **[1.2.0](https://github.com/seedstack/feign-addon/releases/tag/v1.2.0)**
* flyway-addon: **[1.0.0](https://github.com/seedstack/flyway-addon/releases/tag/v1.0.0)**
* i18n-addon: **[4.0.0](https://github.com/seedstack/i18n-addon/releases/tag/v4.0.0)**
* io-addon: **[3.0.0](https://github.com/seedstack/io-addon/releases/tag/v3.0.0)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* jdbc-addon: **[3.0.2](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.2)**
* jmh-addon: **[1.0.2](https://github.com/seedstack/jmh-addon/releases/tag/v1.0.2)**
* jms-addon: **[3.0.1](https://github.com/seedstack/jms-addon/releases/tag/v3.0.1)**
* [chg] jpa-addon: **[4.0.1](https://github.com/seedstack/jpa-addon/releases/tag/v4.0.1)**
* kafka-addon: **[1.0.0](https://github.com/seedstack/kafka-addon/releases/tag/v1.0.0)**
* ldap-addon: **[3.0.0](https://github.com/seedstack/ldap-addon/releases/tag/v3.0.0)**
* metrics-addon: [1.0.0](https://github.com/seedstack/metrics-addon/releases/tag/v1.0.0)
* modelmapper-addon: **[1.0.0](https://github.com/seedstack/modelmapper-addon/releases/tag/v1.0.0)**
* mongodb-addon: **[3.0.0](https://github.com/seedstack/mongodb-addon/releases/tag/v3.0.0)**
* monitoring-addon: **[3.1.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.1.0)**
* mqtt-addon: **[2.0.1](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.1)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* [chg] netflix-addon: **[1.2.1](https://github.com/seedstack/netflix-addon/releases/tag/v1.2.1)**
* [new] oauth-addon: **[1.0.0](https://github.com/seedstack/oauth-addon/releases/tag/v1.0.0)**
* redis-addon: **[2.0.0](https://github.com/seedstack/redis-addon/releases/tag/v2.0.0)**
* [chg] scheduling-addon: **[3.1.0](https://github.com/seedstack/scheduling-addon/releases/tag/v3.1.0)**
* shell-addon: **[1.0.1](https://github.com/seedstack/shell-addon/releases/tag/v1.0.1)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* spring-bridge-addon: **[3.1.0](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.0)**
* [chg] swagger-addon: **[2.0.2](https://github.com/seedstack/swagger-addon/releases/tag/v2.0.2)**
* [chg] w20-bridge-addon: **[3.2.1](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.2.1)**
* [chg] web-bridge-addon: **[1.0.1](https://github.com/seedstack/web-bridge-addon/releases/tag/v1.0.1)**
* [chg] web-services-addon: **[3.0.2](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.2)**

