---
title: "18.7 release notes"
description: SeedStack 18.7 is released!
authors:
  - Adrien LAUER
date: 2018-08-08
slug: 18.7-release-notes
aliases: "/posts/18-7-release-notes"
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 18.7 «Petunia».<!--more-->

## New features

### Bean validation 2.0

Support for bean validation 2.0 has been integrated which brings new features like:

* Support for validating container elements by annotating type arguments of parameterized types: `List<@Positive Integer> positiveNumbers`
* More flexible validation of collection like maps: `Map<@Valid CustomerType, @Valid Customer> customersByType`
* Support for `java.util.Optional`
* Support for custom container types by plugging in additional value extractors
* Support for the JSR 310 date/time types for `@Past` and `@Future`; fine-grained control over the current time and time zone used for validation
* New built-in constraints: `@Email`, `@NotEmpty`, `@NotBlank`, `@Positive`, `@PositiveOrZero`, `@Negative`, `@NegativeOrZero`, `@PastOrPresent` and `@FutureOrPresent`
* All built-in constraints are marked as repeatable

## Fixes

This version contains minor fixes in various components, please check individual component change logs for details.

## Changes

No notable change.

## Component versions

### General

* seedstack-maven-plugin: **[2.7.1](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.7.1)**

### Core

* shed: **[1.1.3](https://github.com/seedstack/shed/releases/tag/v1.1.3)**
* coffig: **[3.1.0](https://github.com/seedstack/coffig/releases/tag/v3.1.0)**
* **[chg]** seed: **[3.7.0](https://github.com/seedstack/seed/releases/tag/v3.7.0)**
* business: **[4.2.1](https://github.com/seedstack/business/releases/tag/v4.2.1)**

### Add-ons

* audit-addon: **[3.0.0](https://github.com/seedstack/audit-addon/releases/tag/v3.0.0)**
* aws-addon: **[1.0.0](https://github.com/seedstack/aws-addon/releases/tag/v1.0.0)**
* cci-addon: **[1.1.0](https://github.com/seedstack/cci-addon/releases/tag/v1.1.0)**
* consul-addon: **[1.0.0](https://github.com/seedstack/consul-addon/releases/tag/v1.0.0)**
* crud-addon: **[1.0.0](https://github.com/seedstack/crud-addon/releases/tag/v1.0.0)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* elasticsearch-addon: **[3.0.0](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.0.0)**
* feign-addon: **[1.2.0](https://github.com/seedstack/feign-addon/releases/tag/v1.2.0)**
* flyway-addon: **[1.0.0](https://github.com/seedstack/flyway-addon/releases/tag/v1.0.0)**
* **[chg]** i18n-addon: **[4.1.0](https://github.com/seedstack/i18n-addon/releases/tag/v4.1.0)**
* io-addon: **[3.0.0](https://github.com/seedstack/io-addon/releases/tag/v3.0.0)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* jdbc-addon: **[3.0.2](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.2)**
* jmh-addon: **[1.0.2](https://github.com/seedstack/jmh-addon/releases/tag/v1.0.2)**
* jms-addon: **[3.0.1](https://github.com/seedstack/jms-addon/releases/tag/v3.0.1)**
* **[chg]** jpa-addon: **[4.0.3](https://github.com/seedstack/jpa-addon/releases/tag/v4.0.3)**
* **[chg]** kafka-addon: **[1.1.0](https://github.com/seedstack/kafka-addon/releases/tag/v1.1.0)**
* ldap-addon: **[3.0.0](https://github.com/seedstack/ldap-addon/releases/tag/v3.0.0)**
* metrics-addon: [1.0.0](https://github.com/seedstack/metrics-addon/releases/tag/v1.0.0)
* modelmapper-addon: **[1.0.0](https://github.com/seedstack/modelmapper-addon/releases/tag/v1.0.0)**
* mongodb-addon: **[3.0.0](https://github.com/seedstack/mongodb-addon/releases/tag/v3.0.0)**
* monitoring-addon: **[3.1.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.1.0)**
* mqtt-addon: **[2.0.1](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.1)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* netflix-addon: **[1.2.1](https://github.com/seedstack/netflix-addon/releases/tag/v1.2.1)**
* oauth-addon: **[1.0.0](https://github.com/seedstack/oauth-addon/releases/tag/v1.0.0)**
* redis-addon: **[2.0.0](https://github.com/seedstack/redis-addon/releases/tag/v2.0.0)**
* scheduling-addon: **[3.1.0](https://github.com/seedstack/scheduling-addon/releases/tag/v3.1.0)**
* shell-addon: **[1.0.1](https://github.com/seedstack/shell-addon/releases/tag/v1.0.1)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* **[chg]** spring-bridge-addon: **[3.1.1](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.1)**
* **[chg]** swagger-addon: **[2.0.3](https://github.com/seedstack/swagger-addon/releases/tag/v2.0.3)**
* **[chg]** w20-bridge-addon: **[3.2.5](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.2.5)**
* **[chg]** web-bridge-addon: **[1.0.2](https://github.com/seedstack/web-bridge-addon/releases/tag/v1.0.2)**
* web-services-addon: **[3.0.2](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.2)**

