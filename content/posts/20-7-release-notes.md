---
title: "20.7 release notes"
description: SeedStack 20.7 is released!
authors:
  - Adrien LAUER
date: 2020-08-27
slug: 20.7-release-notes
aliases: "/posts/20-7-release-notes"
tags:
  - release
zones:
  - Posts
---

We skipped the 20.4 version because of the world pandemic impact, but here we are, with the release of SeedStack 20.7 «Violet».<!--more-->

## New features

### Camel add-on

A new add-on is provided to support [Apache Camel](https://camel.apache.org/). Camel is an Open Source integration framework 
that enables to quickly and easily integrate various systems consuming or producing data. Transactions are not suported yet but
are coming in a future version.

### JCR add-on

A new add-on is provided to support the [JCR specification](https://en.wikipedia.org/wiki/Content_repository_API_for_Java). Content Repository API for Java (JCR) 
is a specification to access content repositories in a uniform manner. The content repositories are used in content management systems to keep the content 
data and also the metadata used in content management systems (CMS) such as versioning metadata.

### Object lifecycle

SeedStack now comes with support for JSR-250 `@PostConstruct` and `@PreDestroy` annotations. The `@PostConstruct` annotation is called just after the 
constructor has been called and the object injected. It can be used for further initialization of objects. The `@PreDestroy` annotation only works on singletons 
and is called at application shutdown, for instance to release resources held by the object.

### Interception API

The `SeedInterceptor` interface can be implemented to define a custom interceptor without relying on Guice classes, thus avoiding coupling to low-level 
libraries.

### Web session cookie options

The `web.sessions.cookie.*` configuration options can be used to customize the Web session cookie characteristics. 
See the `CookieConfig` inner class for all options. 

### Feign interceptors

Each Feign endpoint can now be configured with custom injectable `RequestInterceptor`s. Such interceptors are useful to inject authentication headers
or do any other customization to the request before sending it.

## Fixes

This version contains fixes in various components, please check individual component change logs for details.

## Changes

Apache `commons-lang` library is no longer used internally by SeedStack and has been removed from its dependencies. If your code depends on it, 
add it manually to your project POM. Apache `commons-lang3` is still required by the business framework.

Other minor changes have been made. Please read individual change logs for details. 

## Component versions

### General

* seedstack-maven-plugin: **[2.7.5](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.7.5)**

### Core

* shed: **[1.1.6](https://github.com/seedstack/shed/releases/tag/v1.1.6)**
* **[chg]** coffig: **[3.1.6](https://github.com/seedstack/coffig/releases/tag/v3.1.6)**
* **[chg]** seed: **[3.10.0](https://github.com/seedstack/seed/releases/tag/v3.10.0)**
* **[chg]** business: **[4.2.1](https://github.com/seedstack/business/releases/tag/v4.2.1)**

### Add-ons

* **[chg]** audit-addon: **[3.0.1](https://github.com/seedstack/audit-addon/releases/tag/v3.0.1)**
* aws-addon: **[1.0.0](https://github.com/seedstack/aws-addon/releases/tag/v1.0.0)**
* cci-addon: **[1.1.0](https://github.com/seedstack/cci-addon/releases/tag/v1.1.0)**
* **[new]** camel-addon: **[1.0.0](https://github.com/seedstack/camel-addon/releases/tag/v1.0.0)**
* consul-addon: **[1.0.0](https://github.com/seedstack/consul-addon/releases/tag/v1.0.0)**
* **[chg]** crud-addon: **[1.0.1](https://github.com/seedstack/crud-addon/releases/tag/v1.0.1)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* elasticsearch-addon: **[3.0.0](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.0.0)**
* **[chg]** feign-addon: **[1.4.0](https://github.com/seedstack/feign-addon/releases/tag/v1.4.0)**
* flyway-addon: **[1.0.0](https://github.com/seedstack/flyway-addon/releases/tag/v1.0.0)**
* **[chg]** i18n-addon: **[4.0.2](https://github.com/seedstack/i18n-addon/releases/tag/v4.0.2)**
* **[chg]** io-addon: **[3.0.1](https://github.com/seedstack/io-addon/releases/tag/v3.0.1)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* **[new]** jcr-addon: **[1.0.0](https://github.com/seedstack/jcr-addon/releases/tag/v1.0.0)**
* **[chg]** jdbc-addon: **[3.0.3](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.3)**
* jmh-addon: **[1.0.2](https://github.com/seedstack/jmh-addon/releases/tag/v1.0.2)**
* **[chg]** jms-addon: **[3.1.1](https://github.com/seedstack/jms-addon/releases/tag/v3.1.1)**
* **[chg]** jpa-addon: **[4.1.1](https://github.com/seedstack/jpa-addon/releases/tag/v4.1.1)**
* **[chg]** kafka-addon: **[2.0.1](https://github.com/seedstack/kafka-addon/releases/tag/v2.0.1)**
* ldap-addon: **[3.0.0](https://github.com/seedstack/ldap-addon/releases/tag/v3.0.0)**
* metrics-addon: [1.1.0](https://github.com/seedstack/metrics-addon/releases/tag/v1.1.0)
* modelmapper-addon: **[1.0.0](https://github.com/seedstack/modelmapper-addon/releases/tag/v1.0.0)**
* **[chg]** mongodb-addon: **[3.1.2](https://github.com/seedstack/mongodb-addon/releases/tag/v3.1.2)**
* monitoring-addon: **[3.1.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.1.0)**
* **[chg]** mqtt-addon: **[2.0.1](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.1)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* **[chg]** netflix-addon: **[1.2.2](https://github.com/seedstack/netflix-addon/releases/tag/v1.2.2)**
* **[chg]** oauth-addon: **[1.1.1](https://github.com/seedstack/oauth-addon/releases/tag/v1.1.1)**
* redis-addon: **[2.0.0](https://github.com/seedstack/redis-addon/releases/tag/v2.0.0)**
* **[chg]** scheduling-addon: **[3.3.1](https://github.com/seedstack/scheduling-addon/releases/tag/v3.3.1)**
* shell-addon: **[1.0.1](https://github.com/seedstack/shell-addon/releases/tag/v1.0.1)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* **[chg]** spring-bridge-addon: **[3.1.2](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.2)**
* swagger-addon: **[2.1.2](https://github.com/seedstack/swagger-addon/releases/tag/v2.1.2)**
* **[chg]** w20-bridge-addon: **[3.2.8](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.2.8)**
* **[chg]** web-bridge-addon: **[1.0.4](https://github.com/seedstack/web-bridge-addon/releases/tag/v1.0.4)**
* **[chg]** web-services-addon: **[3.0.4](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.4)**
