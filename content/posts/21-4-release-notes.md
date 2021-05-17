---
title: "21.4 release notes"
description: SeedStack 21.4 is released!
authors: "Adrien LAUER, Sébastien MONEUSE et Hervé STERN"
date: 2021-05-09
slug: 21.4-release-notes 
tags:
  - release 
zones:
  - Posts
---

We are happy to announce the release of SeedStack 21.4 «Xylobium».<!--more-->

## New features

### Check tool

The new `check` tool detects and displays discrepancies between the provided, and the expected configuration. It will
tell you about keys that don't match any configuration object, spotting possible misconfiguration. To run it in a
development environment, use the Maven goal:

```bash
mvn seedstack:check
```

In a production environment you can run it with the `seedstack.tool` launch property:

```bash
java -Dseedstack.tool=check -jar my-app.jar
```

### Business framework improvements

The `FluentAssembler` DSL now supports qualifiers for repositories and factories:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void someMethod() {
        Order aggregateRoot = fluentAssembler.merge(dto)
                .into(Order.class)
                .fromRepository(Jpa.class)
                .orFromFactory("myCustomFactory");
    }
}
```

### Misc

Various other features are provided:

* Support for Java 15
* In Feign add-on, configuration support for retrying logic including injectable custom retrying logic.
* In ElasticSearch add-on, wide support for ElasticSearch client (v2 to v7).
* In Flyway add-on, upgrade to Flyway 7.8.2 and increase configuration options.
* In JPA add-on, support for buffered sequence generators (improve performance by reserving a range of identifiers).
* In Redis add-on, support for Redis clusters.

## Fixes

### Security fixes

Shiro was upgraded to 1.7.1, fixing CVE-2020-11989, CVE-2020-17510, CVE-2020-1957, CVE-2020-13933 and CVE-2019-12422.

The OAuth add-on now properly processes array claims for roles and permissions. An error 500 returned in the case
of an invalid token was also fixed. Invalid token now return 401 codes (as mandated by the spec) instead of 403. The
reason of the 401 is disclosed to the client by default but can be kept secret by setting `discloseUnauthorizedReason`
to `true`.

### Configuration fixes

Configuration evaluation (macros, functions, ...) in `classes` section was not working at all and is now fixed. 
Another problem was that configuration arrays containing generic components (like Class[]) were ignored and not
mapped to configuration objects. This is now also fixed.

### Misc

This version also contains fixes in various components, please check individual component change logs for details.

## Changes

### Library upgrades

Various major libraries were upgraded:

* Guice to 5.0.1
* Jersey to 2.34
* Javassist to 3.27.0-GA
* Guava to 30.1.1-jre
* Flyway to 7.8.2

### Misc

This version also contains changes in various components, please check individual component change logs for details.

## Component versions

### General

* **[chg]** seedstack-maven-plugin: **[2.8.0](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.8.0)**

### Core

* shed: **[1.1.6](https://github.com/seedstack/shed/releases/tag/v1.1.6)**
* **[chg]** coffig: **[3.1.7](https://github.com/seedstack/coffig/releases/tag/v3.1.7)**
* **[chg]** seed: **[3.12.0](https://github.com/seedstack/seed/releases/tag/v3.12.0)**
* **[chg]** business: **[4.4.0](https://github.com/seedstack/business/releases/tag/v4.4.0)**

### Add-ons

* audit-addon: **[3.0.1](https://github.com/seedstack/audit-addon/releases/tag/v3.0.1)**
* aws-addon: **[1.0.0](https://github.com/seedstack/aws-addon/releases/tag/v1.0.0)**
* cci-addon: **[1.1.0](https://github.com/seedstack/cci-addon/releases/tag/v1.1.0)**
* camel-addon: **[1.0.0](https://github.com/seedstack/camel-addon/releases/tag/v1.0.0)**
* consul-addon: **[1.0.0](https://github.com/seedstack/consul-addon/releases/tag/v1.0.0)**
* crud-addon: **[1.0.1](https://github.com/seedstack/crud-addon/releases/tag/v1.0.1)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* **[chg]** elasticsearch-addon: **[3.1.0](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.1.0)**
* **[chg]** feign-addon: **[1.5.0](https://github.com/seedstack/feign-addon/releases/tag/v1.5.0)**
* **[chg]** flyway-addon: **[2.0.0](https://github.com/seedstack/flyway-addon/releases/tag/v2.0.0)**
* i18n-addon: **[4.0.2](https://github.com/seedstack/i18n-addon/releases/tag/v4.0.2)**
* io-addon: **[3.0.1](https://github.com/seedstack/io-addon/releases/tag/v3.0.1)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* jcr-addon: **[1.0.0](https://github.com/seedstack/jcr-addon/releases/tag/v1.0.0)**
* jdbc-addon: **[3.0.3](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.3)**
* jmh-addon: **[1.0.2](https://github.com/seedstack/jmh-addon/releases/tag/v1.0.2)**
* jms-addon: **[3.1.1](https://github.com/seedstack/jms-addon/releases/tag/v3.1.1)**
* **[chg]** jpa-addon: **[4.2.0](https://github.com/seedstack/jpa-addon/releases/tag/v4.2.0)**
* kafka-addon: **[2.0.2](https://github.com/seedstack/kafka-addon/releases/tag/v2.0.2)**
* ldap-addon: **[3.0.0](https://github.com/seedstack/ldap-addon/releases/tag/v3.0.0)**
* metrics-addon: [1.1.0](https://github.com/seedstack/metrics-addon/releases/tag/v1.1.0)
* modelmapper-addon: **[1.0.0](https://github.com/seedstack/modelmapper-addon/releases/tag/v1.0.0)**
* mongodb-addon: **[3.1.2](https://github.com/seedstack/mongodb-addon/releases/tag/v3.1.2)**
* monitoring-addon: **[3.1.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.1.0)**
* mqtt-addon: **[2.0.1](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.1)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* netflix-addon: **[1.2.2](https://github.com/seedstack/netflix-addon/releases/tag/v1.2.2)**
* **[chg]** oauth-addon: **[3.2.0](https://github.com/seedstack/oauth-addon/releases/tag/v3.2.0)**
* **[chg]** redis-addon: **[2.1.0](https://github.com/seedstack/redis-addon/releases/tag/v2.1.0)**
* scheduling-addon: **[3.3.1](https://github.com/seedstack/scheduling-addon/releases/tag/v3.3.1)**
* shell-addon: **[1.0.1](https://github.com/seedstack/shell-addon/releases/tag/v1.0.1)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* spring-bridge-addon: **[3.1.2](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.2)**
* swagger-addon: **[2.1.2](https://github.com/seedstack/swagger-addon/releases/tag/v2.1.2)**
* w20-bridge-addon: **[3.2.8](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.2.8)**
* web-bridge-addon: **[1.0.4](https://github.com/seedstack/web-bridge-addon/releases/tag/v1.0.4)**
* web-services-addon: **[3.0.4](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.4)**
