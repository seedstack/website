---
title: "18.11 release notes"
description: SeedStack 18.11 is released!
authors:
  - Adrien LAUER
date: 2018-12-04
slug: 18.11-release-notes
aliases: "/posts/18-11-release-notes"
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 18.11 «Quince».<!--more-->

## New features

Minor new features were added in various components, please check individual component change logs for details.

## Fixes

This version contains minor fixes in various components, please check individual component change logs for details.

## Changes

### Composites have been removed

Composite poms were distributed before 18.11 to group common dependencies by interest (web-composite, cli-composite, ...)
but they were making the project dependencies non-obvious for developers. Dependencies that were in composites are now
directly put in each project template. As they are generated, project will now have the common dependencies directly in
their POMs.

To migrate your existing projects, for each composite present in your POMs:

* Go the [old distribution source](https://github.com/seedstack/distribution/tree/v18.7.1)
* Go into the folder of the corresponding composite and look at the `pom.xml` file,
* In your project, replace the composite dependency itself with the dependencies found within the composite POM.
* Remove duplicate dependencies if any.

### Runtime information update

Runtime information such as Web server base URL, servlet context path or REST base path have been grouped under the `runtime`
configuration node:  

```yaml
runtime:
  web:
    # The base url of the Web application (protocol + host + port + context path) without a trailing slash
    # Available only when running with a supported embedded server (like Undertow)
    baseUrl: (String)

    # Same as runtime.web.baseUrl but with a trailing slash
    # Available only when running with a supported embedded server (like Undertow)
    baseUrlSlash: (String)

    # Available only when running with a supported embedded server (like Undertow)
    server:
      # The protocol used by the Web server
      protocol: (String)
    
      # The host used by the Web server
      host: (String)
    
      # The port used by the Web server
      port: (int)
      
    # Available when running in any servlet container (embedded or not)
    servlet:
      # The context path of the servlet container
      contextPath: (String)
        
      # The virtual server name of the servlet container if available
      virtualServerName: (String)
      
  rest:
    # The base url of the REST API (protocol + host + port + context path + JAX-RS base path) without a trailing slash
    # Available only when running with a supported embedded server (like Undertow)
    baseUrl: (String)
        
    # Same as runtime.rest.baseUrl but with a trailing slash
    # Available only when running with a supported embedded server (like Undertow)
    baseUrlSlash: (String)
```

As the `runtime.web.baseUrl` is mainly used in Web integration tests, please review all of them to update the configuration
property.

## Component versions

### General

* seedstack-maven-plugin: **[2.7.3](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.7.3)**

### Core

* **[chg]** shed: **[1.1.4](https://github.com/seedstack/shed/releases/tag/v1.1.4)**
* **[chg]** coffig: **[3.1.3](https://github.com/seedstack/coffig/releases/tag/v3.1.3)**
* **[chg]** seed: **[3.8.0](https://github.com/seedstack/seed/releases/tag/v3.8.0)**
* **[chg]** business: **[4.2.2](https://github.com/seedstack/business/releases/tag/v4.2.2)**

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
* i18n-addon: **[4.0.1](https://github.com/seedstack/i18n-addon/releases/tag/v4.0.1)**
* io-addon: **[3.0.0](https://github.com/seedstack/io-addon/releases/tag/v3.0.0)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* jdbc-addon: **[3.0.2](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.2)**
* jmh-addon: **[1.0.2](https://github.com/seedstack/jmh-addon/releases/tag/v1.0.2)**
* jms-addon: **[3.0.1](https://github.com/seedstack/jms-addon/releases/tag/v3.0.1)**
* **[chg]** jpa-addon: **[4.0.4](https://github.com/seedstack/jpa-addon/releases/tag/v4.0.4)**
* kafka-addon: **[1.1.0](https://github.com/seedstack/kafka-addon/releases/tag/v1.1.0)**
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
* spring-bridge-addon: **[3.1.1](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.1)**
* **[chg]** swagger-addon: **[2.1.0](https://github.com/seedstack/swagger-addon/releases/tag/v2.1.0)**
* **[chg]** w20-bridge-addon: **[3.2.6](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.2.6)**
* web-bridge-addon: **[1.0.2](https://github.com/seedstack/web-bridge-addon/releases/tag/v1.0.2)**
* **[chg]** web-services-addon: **[3.0.3](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.3)**

