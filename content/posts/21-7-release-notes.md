---
title: "21.7 release notes"
description: SeedStack 21.7 is released!
authors: 
  - Adrien LAUER
  - Sébastien MONEUSE
  - Hervé STERN
date: 2021-07-23
slug: 21.7-release-notes 
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 21.7 «Yucca».<!--more-->

## New features

### YAML/JSON configuration values

SeedStack now supports dynamic parsing of YAML/JSON configuration values. This allows to access valid YAML/JSON values
as trees. 

Suppose you have a `MY_DB_SECRET` environment variables containing JSON:

```json
{
  "dbClusterIdentifier": "...",
  "password": "...",
  "dbname": "...",
  "engine": "...",
  "port": 5432,
  "host": "...",
  "username": "..."
}
```

You parse the environment variable JSON in an intermediate tree, and then refer to the individual fields by using config
macros to build a JDBC URL (for instance):

```yaml
myApp:
  dbConfig|json: ${env.MY_DB_SECRET}

jdbc:
  datasources:
    myDatasource:
      url: jdbc:postgresql://${myApp.dbConfig.host}:${myApp.dbConfig.port}/${myApp.dbConfig.dbname}?user=${myApp.dbConfig.username}&password=${myApp.dbConfig.password}&currentSchema=guitars
```

### Config profile environment variable

In addition to the existing `seedstack.profiles` system property, you can now activate configuration profiles by setting
the `SEEDSTACK_PROFILES` environment variable:

```bash
export SEEDSTACK_PROFILES=profile1,profile2
java -jar my-app.jar
```

Configuration profiles `profile1` and `profile2` will be activated. If you specify both the environment variable and the
system property, the union of all profiles will be activated.

### Diagnostic resource

If config option rest.diagnosticResource is set to true, the diagnostic report will be available as a JSON representation 
at `[restPath]/seedstack/diagnostic`. Default is false. **Do not enable permanently in production!**

## Fixes

This version also contains fixes in various components, please check individual component change logs for details.

## Changes

This version also contains changes in various components, please check individual component change logs for details.

## Component versions

### General

* seedstack-maven-plugin: **[2.8.0](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.8.0)**

### Core

* shed: **[1.1.6](https://github.com/seedstack/shed/releases/tag/v1.1.6)**
* **[chg]** coffig: **[3.1.8](https://github.com/seedstack/coffig/releases/tag/v3.1.8)**
* **[chg]** seed: **[3.13.0](https://github.com/seedstack/seed/releases/tag/v3.13.0)**
* business: **[4.4.0](https://github.com/seedstack/business/releases/tag/v4.4.0)**

### Add-ons

* audit-addon: **[3.0.1](https://github.com/seedstack/audit-addon/releases/tag/v3.0.1)**
* aws-addon: **[1.0.0](https://github.com/seedstack/aws-addon/releases/tag/v1.0.0)**
* cci-addon: **[1.1.0](https://github.com/seedstack/cci-addon/releases/tag/v1.1.0)**
* camel-addon: **[1.0.0](https://github.com/seedstack/camel-addon/releases/tag/v1.0.0)**
* consul-addon: **[1.0.0](https://github.com/seedstack/consul-addon/releases/tag/v1.0.0)**
* crud-addon: **[1.0.1](https://github.com/seedstack/crud-addon/releases/tag/v1.0.1)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* elasticsearch-addon: **[3.1.0](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.1.0)**
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
* **[chg]** mongodb-addon: **[3.1.3](https://github.com/seedstack/mongodb-addon/releases/tag/v3.1.3)**
* monitoring-addon: **[3.1.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.1.0)**
* mqtt-addon: **[2.0.1](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.1)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* netflix-addon: **[1.2.2](https://github.com/seedstack/netflix-addon/releases/tag/v1.2.2)**
* oauth-addon: **[3.2.0](https://github.com/seedstack/oauth-addon/releases/tag/v3.2.0)**
* redis-addon: **[2.1.0](https://github.com/seedstack/redis-addon/releases/tag/v2.1.0)**
* scheduling-addon: **[3.3.1](https://github.com/seedstack/scheduling-addon/releases/tag/v3.3.1)**
* shell-addon: **[1.0.1](https://github.com/seedstack/shell-addon/releases/tag/v1.0.1)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* spring-bridge-addon: **[3.1.2](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.2)**
* swagger-addon: **[2.1.2](https://github.com/seedstack/swagger-addon/releases/tag/v2.1.2)**
* w20-bridge-addon: **[3.2.8](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.2.8)**
* web-bridge-addon: **[1.0.4](https://github.com/seedstack/web-bridge-addon/releases/tag/v1.0.4)**
* web-services-addon: **[3.0.4](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.4)**
