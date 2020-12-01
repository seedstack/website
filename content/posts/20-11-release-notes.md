---
title: "20.11 release notes"
description: SeedStack 20.11 is released!
authors:
  - Adrien LAUER
date: 2020-11-30
slug: 20.11-release-notes
aliases: "/posts/20-11-release-notes"
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 19.11 «Willow».<!--more-->

## New features

### OAuth/OpenIdConnect

This version features a vastly improved OAuth:

* Now properly supports bearer tokens, so it is no longer limited to authorization code flow.
* Improved token validation logic.
* Default opaque access token validator (which calls user info endpoint).
* No longer calls user info endpoint by default. Use claims from ID tokens for subject details if available. Can still
call user info autom    atically to enrich those claims if configured so.
* Provides raw tokens and raw user info details as subject principals.
* Maps OAuth scopes to subject permissions by default. It can be configured to consider OAuth scopes as applicative
roles instead.
* Uses the application id as the default allowed audience. Can be overridden in configuration.

### Undertow handlers support

A `undertow-handlers.conf` file can now be specified, allowing to declare a sequence of any [Undertow built-in handler](https://undertow.io/undertow-docs/undertow-docs-2.1.0/index.html#built-in-handlers).
Its default location is at the root of the classpath (for instance in `src/main/resources`), but can be configured with
the `web.server.undertow.handlersFile` option.

{{% callout info %}}
The file is a collection declarations following the [textual representation of predicated handlers](https://undertow.io/undertow-docs/undertow-docs-2.1.0/#textual-representation).
{{% /callout %}}

## Fixes

This version contains fixes in various components, please check individual component change logs for details.

## Changes

This version contains changes in various components, please check individual component change logs for details.

## Component versions

### General

* seedstack-maven-plugin: **[2.7.6](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.7.5)**

### Core

* shed: **[1.1.6](https://github.com/seedstack/shed/releases/tag/v1.1.6)**
* coffig: **[3.1.6](https://github.com/seedstack/coffig/releases/tag/v3.1.6)**
* **[chg]** seed: **[3.11.0](https://github.com/seedstack/seed/releases/tag/v3.11.0)**
* business: **[4.3.1](https://github.com/seedstack/business/releases/tag/v4.3.1)**

### Add-ons

* audit-addon: **[3.0.1](https://github.com/seedstack/audit-addon/releases/tag/v3.0.1)**
* aws-addon: **[1.0.0](https://github.com/seedstack/aws-addon/releases/tag/v1.0.0)**
* cci-addon: **[1.1.0](https://github.com/seedstack/cci-addon/releases/tag/v1.1.0)**
* camel-addon: **[1.0.0](https://github.com/seedstack/camel-addon/releases/tag/v1.0.0)**
* consul-addon: **[1.0.0](https://github.com/seedstack/consul-addon/releases/tag/v1.0.0)**
* crud-addon: **[1.0.1](https://github.com/seedstack/crud-addon/releases/tag/v1.0.1)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* elasticsearch-addon: **[3.0.0](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.0.0)**
* feign-addon: **[1.4.0](https://github.com/seedstack/feign-addon/releases/tag/v1.4.0)**
* flyway-addon: **[1.0.0](https://github.com/seedstack/flyway-addon/releases/tag/v1.0.0)**
* i18n-addon: **[4.0.2](https://github.com/seedstack/i18n-addon/releases/tag/v4.0.2)**
* io-addon: **[3.0.1](https://github.com/seedstack/io-addon/releases/tag/v3.0.1)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* jcr-addon: **[1.0.0](https://github.com/seedstack/jcr-addon/releases/tag/v1.0.0)**
* jdbc-addon: **[3.0.3](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.3)**
* jmh-addon: **[1.0.2](https://github.com/seedstack/jmh-addon/releases/tag/v1.0.2)**
* jms-addon: **[3.1.1](https://github.com/seedstack/jms-addon/releases/tag/v3.1.1)**
* jpa-addon: **[4.1.1](https://github.com/seedstack/jpa-addon/releases/tag/v4.1.1)**
* **[chg]** kafka-addon: **[2.0.2](https://github.com/seedstack/kafka-addon/releases/tag/v2.0.2)**
* ldap-addon: **[3.0.0](https://github.com/seedstack/ldap-addon/releases/tag/v3.0.0)**
* metrics-addon: [1.1.0](https://github.com/seedstack/metrics-addon/releases/tag/v1.1.0)
* modelmapper-addon: **[1.0.0](https://github.com/seedstack/modelmapper-addon/releases/tag/v1.0.0)**
* mongodb-addon: **[3.1.2](https://github.com/seedstack/mongodb-addon/releases/tag/v3.1.2)**
* monitoring-addon: **[3.1.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.1.0)**
* mqtt-addon: **[2.0.1](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.1)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* netflix-addon: **[1.2.2](https://github.com/seedstack/netflix-addon/releases/tag/v1.2.2)**
* **[chg]** oauth-addon: **[3.0.0](https://github.com/seedstack/oauth-addon/releases/tag/v3.0.0)**
* **[chg]** redis-addon: **[2.0.1](https://github.com/seedstack/redis-addon/releases/tag/v2.0.1)**
* scheduling-addon: **[3.3.1](https://github.com/seedstack/scheduling-addon/releases/tag/v3.3.1)**
* shell-addon: **[1.0.1](https://github.com/seedstack/shell-addon/releases/tag/v1.0.1)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* spring-bridge-addon: **[3.1.2](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.2)**
* swagger-addon: **[2.1.2](https://github.com/seedstack/swagger-addon/releases/tag/v2.1.2)**
* w20-bridge-addon: **[3.2.8](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.2.8)**
* web-bridge-addon: **[1.0.4](https://github.com/seedstack/web-bridge-addon/releases/tag/v1.0.4)**
* web-services-addon: **[3.0.4](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.4)**
