---
title: "24.4 release notes"
description: SeedStack 24.4 is released!
authors: 
  - Adrien LAUER
date: 2024-04-17
slug: 24.4-release-notes 
tags:
  - release
zones:
  - Posts
---

After a long time without release, we are happy to announce the release of SeedStack 24.4, which now supports Java 21.<!--more-->

## New features

This is a maintenance release for Java 21 support. No new features have been added, beyond what may be provided
by the updated libraries.

## Fixes

This is a maintenance release for Java 21 support. No fixes have been done, beyond what may be provided
by the updated libraries.

## Changes

Core libraries have been updated to their latest versions without breaking compatibility. This means that there is
support for Java 21 and the `jakarta.inject.*` package, while still retaining compatibility with Java 8 and the
`javax.inject.*` package. Other `jakarta.*` packages are not supported in this version, because there is no simple way
to support them without breaking compatibility.

## Component versions

### General

* **[chg]** seedstack-maven-plugin: **[2.8.1](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.8.1)**

### Core

* shed: **[1.1.6](https://github.com/seedstack/shed/releases/tag/v1.1.6)**
* coffig: **[3.1.8](https://github.com/seedstack/coffig/releases/tag/v3.1.8)**
* **[chg]** seed: **[3.15.0](https://github.com/seedstack/seed/releases/tag/v3.15.0)**
* **[chg]** business: **[4.5.0](https://github.com/seedstack/business/releases/tag/v4.5.0)**

### Add-ons

* audit-addon: **[3.0.1](https://github.com/seedstack/audit-addon/releases/tag/v3.0.1)**
* aws-addon: **[1.0.0](https://github.com/seedstack/aws-addon/releases/tag/v1.0.0)**
* cci-addon: **[1.1.0](https://github.com/seedstack/cci-addon/releases/tag/v1.1.0)**
* camel-addon: **[1.0.0](https://github.com/seedstack/camel-addon/releases/tag/v1.0.0)**
* consul-addon: **[1.0.0](https://github.com/seedstack/consul-addon/releases/tag/v1.0.0)**
* crud-addon: **[1.0.1](https://github.com/seedstack/crud-addon/releases/tag/v1.0.1)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* elasticsearch-addon: **[3.1.1](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.1.1)**
* feign-addon: **[1.5.0](https://github.com/seedstack/feign-addon/releases/tag/v1.5.0)**
* flyway-addon: **[2.0.0](https://github.com/seedstack/flyway-addon/releases/tag/v2.0.0)**
* i18n-addon: **[4.0.2](https://github.com/seedstack/i18n-addon/releases/tag/v4.0.2)**
* io-addon: **[3.0.1](https://github.com/seedstack/io-addon/releases/tag/v3.0.1)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* jcr-addon: **[1.0.0](https://github.com/seedstack/jcr-addon/releases/tag/v1.0.0)**
* jdbc-addon: **[3.0.3](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.3)**
* jmh-addon: **[1.0.2](https://github.com/seedstack/jmh-addon/releases/tag/v1.0.2)**
* jms-addon: **[3.1.1](https://github.com/seedstack/jms-addon/releases/tag/v3.1.1)**
* jpa-addon: **[4.2.0](https://github.com/seedstack/jpa-addon/releases/tag/v4.2.0)**
* kafka-addon: **[2.0.2](https://github.com/seedstack/kafka-addon/releases/tag/v2.0.2)**
* ldap-addon: **[3.0.0](https://github.com/seedstack/ldap-addon/releases/tag/v3.0.0)**
* metrics-addon: [1.1.0](https://github.com/seedstack/metrics-addon/releases/tag/v1.1.0)
* modelmapper-addon: **[1.0.0](https://github.com/seedstack/modelmapper-addon/releases/tag/v1.0.0)**
* mongodb-addon: **[3.1.3](https://github.com/seedstack/mongodb-addon/releases/tag/v3.1.3)**
* monitoring-addon: **[3.1.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.1.0)**
* mqtt-addon: **[2.0.1](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.1)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* netflix-addon: **[1.2.2](https://github.com/seedstack/netflix-addon/releases/tag/v1.2.2)**
* oauth-addon: **[3.3.0](https://github.com/seedstack/oauth-addon/releases/tag/v3.3.0)**
* redis-addon: **[2.1.0](https://github.com/seedstack/redis-addon/releases/tag/v2.1.0)**
* scheduling-addon: **[3.3.1](https://github.com/seedstack/scheduling-addon/releases/tag/v3.3.1)**
* shell-addon: **[1.0.1](https://github.com/seedstack/shell-addon/releases/tag/v1.0.1)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* spring-bridge-addon: **[3.1.2](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.2)**
* swagger-addon: **[2.1.2](https://github.com/seedstack/swagger-addon/releases/tag/v2.1.2)**
* w20-bridge-addon: **[3.2.8](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.2.8)**
* web-bridge-addon: **[1.0.4](https://github.com/seedstack/web-bridge-addon/releases/tag/v1.0.4)**
* web-services-addon: **[3.0.4](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.4)**
