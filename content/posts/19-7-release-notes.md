---
title: "19.7 release notes"
description: SeedStack 19.7 is released!
authors:
  - Adrien LAUER
date: 2019-09-16
slug: 19.7-release-notes
aliases: "/posts/19-7-release-notes"
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 19.7 «Sycamore».<!--more-->

## New features

### Diagnostic tool (19.7.2+)

You can now trigger a diagnostic manually by using the Maven `diag` goal:

```bash
mvn seedstack:diag
```

Or directly by [running the packaged application capsule]({{< ref "docs/core/index.md#capsule" >}}):
 
```bash
java -Dseedstack.tool=diag -jar app-capsule.jar
``` 

### Metrics (19.7.1+)

The Metrics add-on has been fixed to work with the latest SeedStack version. Beyond this fix, Metrics servlet support has been
added. In a Web application, the following Servlets will be automatically activated:

* Metrics servlet, publishing all application metrics in a JSON format.
* Health servlet, publishing the application health checks status in a JSON format.
* Ping servlet, always responding with 200 OK when the application is up and running.

You can configure whether you want servlets to be enabled or not or which individual servlet is exposed. Other available
servlets not activated by default (for security reasons):

* CPU servlet, publishing a sample of CPU profiling in the [GPerfTools](https://github.com/gperftools/gperftools) format.
* Threads servlet, publishing a thread dump.

{{% callout info %}}
The Metrics library itself has also been updated.
{{% /callout %}}

## Fixes

This version contains minor fixes in various components, please check individual component change logs for details.

## Changes

### Truststore

In previous releases, the Java truststore used for TLS connections was loaded from the same source as the `master` keystore,
effectively making them one and the same. Now the truststore is configured separately:

```yaml
crypto:
  truststore:
    path: src/main/resources/truststore.jks
    password: somePassword
  keystores:
    master:
      path: src/main/resources/master.jks
      password: otherPassword
```  

There are several benefits from this simpler approach:
 
* If you don't configure a truststore, the default Java truststore will still be used (even if a master keystore is configured),
* You can put the CA certificates separately from your own.
* You can still use the standard Java properties to alter the default Java keystore location when left unconfigured. 

### External certificates

{{% callout warning %}}
For security reasons, the ability to load external certificates (living outside a keystore) has been removed. The best
practice is always to store your certificates in a store (keystore or truststore depending on their intented usage). 
{{% /callout %}}

## Component versions

### General

* **[chg]** seedstack-maven-plugin: **[2.7.5](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.7.5)**

### Core

* **[chg]** shed: **[1.1.6](https://github.com/seedstack/shed/releases/tag/v1.1.6)**
* **[chg]** coffig: **[3.1.5](https://github.com/seedstack/coffig/releases/tag/v3.1.5)**
* **[chg]** seed: **[3.9.0](https://github.com/seedstack/seed/releases/tag/v3.9.0)**
* business: **[4.2.2](https://github.com/seedstack/business/releases/tag/v4.2.2)**

### Add-ons

* audit-addon: **[3.0.0](https://github.com/seedstack/audit-addon/releases/tag/v3.0.0)**
* aws-addon: **[1.0.0](https://github.com/seedstack/aws-addon/releases/tag/v1.0.0)**
* cci-addon: **[1.1.0](https://github.com/seedstack/cci-addon/releases/tag/v1.1.0)**
* consul-addon: **[1.0.0](https://github.com/seedstack/consul-addon/releases/tag/v1.0.0)**
* crud-addon: **[1.0.0](https://github.com/seedstack/crud-addon/releases/tag/v1.0.0)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* elasticsearch-addon: **[3.0.0](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.0.0)**
* feign-addon: **[1.3.0](https://github.com/seedstack/feign-addon/releases/tag/v1.3.0)**
* flyway-addon: **[1.0.0](https://github.com/seedstack/flyway-addon/releases/tag/v1.0.0)**
* i18n-addon: **[4.0.1](https://github.com/seedstack/i18n-addon/releases/tag/v4.0.1)**
* io-addon: **[3.0.0](https://github.com/seedstack/io-addon/releases/tag/v3.0.0)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* jdbc-addon: **[3.0.2](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.2)**
* jmh-addon: **[1.0.2](https://github.com/seedstack/jmh-addon/releases/tag/v1.0.2)**
* jms-addon: **[3.0.1](https://github.com/seedstack/jms-addon/releases/tag/v3.0.1)**
* jpa-addon: **[4.0.5](https://github.com/seedstack/jpa-addon/releases/tag/v4.0.5)**
* kafka-addon: **[2.0.0](https://github.com/seedstack/kafka-addon/releases/tag/v2.0.0)**
* ldap-addon: **[3.0.0](https://github.com/seedstack/ldap-addon/releases/tag/v3.0.0)**
* **[chg]** metrics-addon: [1.1.0](https://github.com/seedstack/metrics-addon/releases/tag/v1.1.0)
* modelmapper-addon: **[1.0.0](https://github.com/seedstack/modelmapper-addon/releases/tag/v1.0.0)**
* mongodb-addon: **[3.0.2](https://github.com/seedstack/mongodb-addon/releases/tag/v3.0.2)**
* monitoring-addon: **[3.1.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.1.0)**
* mqtt-addon: **[2.0.1](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.1)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* netflix-addon: **[1.2.1](https://github.com/seedstack/netflix-addon/releases/tag/v1.2.1)**
* oauth-addon: **[1.0.0](https://github.com/seedstack/oauth-addon/releases/tag/v1.0.0)**
* redis-addon: **[2.0.0](https://github.com/seedstack/redis-addon/releases/tag/v2.0.0)**
* scheduling-addon: **[3.1.0](https://github.com/seedstack/scheduling-addon/releases/tag/v3.1.0)**
* shell-addon: **[1.0.1](https://github.com/seedstack/shell-addon/releases/tag/v1.0.1)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* spring-bridge-addon: **[3.1.1](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.1)**
* **[chg]** swagger-addon: **[2.1.2](https://github.com/seedstack/swagger-addon/releases/tag/v2.1.2)**
* w20-bridge-addon: **[3.2.7](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.2.7)**
* web-bridge-addon: **[1.0.3](https://github.com/seedstack/web-bridge-addon/releases/tag/v1.0.3)**
* web-services-addon: **[3.0.3](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.3)**

