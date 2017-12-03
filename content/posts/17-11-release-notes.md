---
title: "17.11 release notes"
description: We are happy to announce the release of SeedStack 17.11!
authors:
  - Adrien LAUER
date: 2017-12-03
slug: 17.11-release-notes
aliases: "/posts/17-11-release-notes"
tags:
  - release
zones:
  - Posts
---

We are happy to announce the release of SeedStack 17.11 «Nymphaea». The highlight is a major update to the business framework 
but it also contains two new add-ons, one being to use [Apache Kafka](https://kafka.apache.org/) in SeedStack apps.<!--more--> 

{{% callout info %}}
See the [full changelog on GitHub](https://github.com/seedstack/distribution/releases/tag/v17.11).
{{% /callout %}}

## New features

### Major update of business framework

The business framework 4.0 is a brand new version with many new capabilities, a greatly simplified API and usage.

#### Specifications

* DDD specifications have been added, allowing to do data queries on the object model, which are automatically translated
to the corresponding underlying persistence query.
* A specification builder provides the ability to easily compose complex specifications.
* The repository interface is fully updated to provide the illusion of an aggregate collection.

```java
public class SomeClass {
    @Inject
    @Jpa
    private Repository<Product, Long> repository;
    @Inject
    private SpecificationBuilder specificationBuilder;

    public void someMethod() {
       Stream<Product> products = repository.get(specificationBuilder.of(Product.class)
                       .property("pictures.url").equalTo("http://some.org/pictures/picture2")
                       .or()
                       .property("designation").equalTo("Some product").and()
                       .property("price").equalTo(2d)
                       .build()); 
    }
}
```

{{% callout info %}}
Specification translation is currently only implemented in [JPA]({{< ref "addons/jpa/index.md" >}}) and 
[MongoDB Morphia]({{< ref "addons/mongodb/morphia.md" >}}) add-ons.
{{% /callout %}}


#### Overriding implementations

Implementations of repositories, factories, services, policies and assemblers can be overridden with an annotation.

```java
public class SomeNominalRepository 
             extends BaseInMemoryRepository<SomeAggregate, String> 
             implements SomeRepository {

}
```

```java
@Overriding
public class SomeOverridingRepository 
             extends BaseInMemoryRepository<SomeAggregate, String> 
             implements SomeRepository {
    // Will always be injected for @Inject SomeRepository
}
```

#### New pagination API

Brand-new pagination API that supports offset-based, page-based and key-based pagination models. A DSL makes it easy
to paginate from repositories to streams, collections, arrays and pages. It can be combined with FluentAssembler to
do end-to-end pagination:

```java
public class SomeClass {
    @Inject
    @Jpa
    private Repository<Product, Long> repository;
    @Inject
    private Paginator paginator;
    
    public void someMethod() {
        Page<ProductDto> products = fluentAssembler.assemble(
            paginator.paginate(repository)
                .byPage(2)
                .ofSize(10)
                .matching(ProductSpecification.OUTDATED_PRODUCTS))
            .toPageOf(ProductDto.class);
    }
}
```

#### In-memory repository

An in-memory repository implementation is built-in for tests and demonstration-purposes.

```java
public class SomeClass {
    @Inject
    @InMemory
    private Repository<Product, Long> repository;
}
```  

### Hot-reloading development mode

By invoking the `watch` goal of the Maven plugin, the application will be run in hot-reloading mode:
 
```bash
mvn seedstack:watch
```

The maven plugin will watch any source change and if any, will refresh the application taking the changes into account.

### Kafka add-on

This add-on enables the usage of [Apache Kafka](https://kafka.apache.org/) through the client (publishing/subscribe) 
or the streaming API. 

### CCI add-on

This new add-on allows to interface your SeedStack application to legacy enterprise information systems (EIS) by using
the [Common-Client Interface (CCI)](https://docs.oracle.com/javaee/6/tutorial/doc/gipju.html). 
This provides connectivity to mainframe-based systems.

## Fixes

This version contains minor fixes in various components, please check individual component change logs for details.

## Changes

### Business framework changes

The business framework 4.x branch doesn't attempt to maintain backwards compatibility with the 3.x branch.

**That said, two compatibility options are provided.**

#### Business migrate module

The first compatibility option is for people who want compatibility with minimal code changes, with the goal of 
upgrading to 4.x branch in the long term . 

The `business-migrate` module provides classes that implement the business 3.x API with the business 4.x. Some classes 
are kept exactly the same, and some are renamed `Legacy*` to avoid clashing with new `business-core` classes.

To use this option, put the following dependency along the `business-core` dependency:

{{< dependency g="org.seedstack.business" a="business-migrate" >}}

The spirit of the `business-migrate` module is to offer immediate backwards compatibility with minimal effort, and allow
you to migrate progressively to business 4.x code. Compatibility classes are marked as deprecated. 

{{% callout info %}}
A upcoming guide will provide instructions on how to use the `business-migrate` module.
{{% /callout %}}

#### SeedStack compatibility BOM

The second compatibility option is for people who don't intend to upgrade the existing code base and want to continue
to use the business 3.x branch. To do that, you just have to replace `seedstack-bom` in your POM by `seedstack-bom-compat`.

All components will be upgraded, except the business framework and components that depend on it.   

### Other changes

Apart from the business framework, this version only contains minor breaking changes, please check individual component 
change logs for details.

## Component versions

### General

* [chg] poms: **[3.1.1](https://github.com/seedstack/poms/releases/tag/v3.1.1)**
* seedstack-maven-plugin: **[2.7.0](https://github.com/seedstack/seedstack-maven-plugin/releases/tag/v2.7.0)**

### Core

* [chg] shed: **[1.1.1](https://github.com/seedstack/shed/releases/tag/v1.1.1)**
* [chg] coffig: **[3.0.1](https://github.com/seedstack/coffig/releases/tag/v3.0.1)**
* [chg] seed: **[3.4.1](https://github.com/seedstack/seed/releases/tag/v3.4.1)**
* [chg] business: **[4.1.0](https://github.com/seedstack/business/releases/tag/v4.1.0)**

### Add-ons

* audit-addon: **[3.0.0](https://github.com/seedstack/audit-addon/releases/tag/v3.0.0)**
* aws-addon: **[1.0.0](https://github.com/seedstack/aws-addon/releases/tag/v1.0.0)**
* [new] cci-addon: **[1.0.0](https://github.com/seedstack/cci-addon/releases/tag/v1.0.0)**
* consul-addon: **[1.0.0](https://github.com/seedstack/consul-addon/releases/tag/v1.0.0)**
* data-security-addon: **[1.0.0](https://github.com/seedstack/data-security-addon/releases/tag/v1.0.0)**
* elasticsearch-addon: **[3.0.0](https://github.com/seedstack/elasticsearch-addon/releases/tag/v3.0.0)**
* [chg] feign-addon: **[1.1.0](https://github.com/seedstack/feign-addon/releases/tag/v1.1.0)**
* flyway-addon: **[1.0.0](https://github.com/seedstack/flyway-addon/releases/tag/v1.0.0)**
* [chg] i18n-addon: **[4.0.0](https://github.com/seedstack/i18n-addon/releases/tag/v4.0.0)**
* io-addon: **[3.0.0](https://github.com/seedstack/io-addon/releases/tag/v3.0.0)**
* javamail-addon: **[3.0.0](https://github.com/seedstack/javamail-addon/releases/tag/v3.0.0)**
* jcache-addon: **[3.0.0](https://github.com/seedstack/jcache-addon/releases/tag/v3.0.0)**
* jdbc-addon: **[3.0.2](https://github.com/seedstack/jdbc-addon/releases/tag/v3.0.2)**
* jmh-addon: **[1.0.2](https://github.com/seedstack/jmh-addon/releases/tag/v1.0.2)**
* jms-addon: **[3.0.1](https://github.com/seedstack/jms-addon/releases/tag/v3.0.1)**
* [chg] jpa-addon: **[4.0.0](https://github.com/seedstack/jpa-addon/releases/tag/v4.0.0)**
* [new] kafka-addon: **[1.0.0](https://github.com/seedstack/kafka-addon/releases/tag/v1.0.0)**
* ldap-addon: **[3.0.0](https://github.com/seedstack/ldap-addon/releases/tag/v3.0.0)**
* metrics-addon: [1.0.0](https://github.com/seedstack/metrics-addon/releases/tag/v1.0.0)
* [new] modelmapper-addon: **[1.0.0](https://github.com/seedstack/modelmapper-addon/releases/tag/v1.0.0)**
* [chg] mongodb-addon: **[3.0.0](https://github.com/seedstack/mongodb-addon/releases/tag/v3.0.0)**
* monitoring-addon: **[3.1.0](https://github.com/seedstack/monitoring-addon/releases/tag/v3.1.0)**
* mqtt-addon: **[2.0.1](https://github.com/seedstack/mqtt-addon/releases/tag/v2.0.1)**
* neo4j-addon: **[2.0.0](https://github.com/seedstack/neo4j-addon/releases/tag/v2.0.0)**
* [chg] netflix-addon: **[1.1.0](https://github.com/seedstack/netflix-addon/releases/tag/v1.1.0)**
* redis-addon: **[2.0.0](https://github.com/seedstack/redis-addon/releases/tag/v2.0.0)**
* scheduling-addon: **[3.0.0](https://github.com/seedstack/scheduling-addon/releases/tag/v3.0.0)**
* [chg] shell-addon: **[1.0.1](https://github.com/seedstack/shell-addon/releases/tag/v1.0.1)**
* solr-addon: **[2.0.0](https://github.com/seedstack/solr-addon/releases/tag/v2.0.0)**
* spring-bridge-addon: **[3.1.0](https://github.com/seedstack/spring-bridge-addon/releases/tag/v3.1.0)**
* swagger-addon: **[2.0.1](https://github.com/seedstack/swagger-addon/releases/tag/v2.0.1)**
* w20-bridge-addon: **[3.1.0](https://github.com/seedstack/w20-bridge-addon/releases/tag/v3.1.0)**
* web-bridge-addon: **[1.0.0](https://github.com/seedstack/web-bridge-addon/releases/tag/v1.0.0)**
* [chg] web-services-addon: **[3.0.2](https://github.com/seedstack/web-services-addon/releases/tag/v3.0.2)**

