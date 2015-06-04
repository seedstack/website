---
title: "Overview"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedCache"
tags:
    - "cache"
    - "maven"
menu:
    SeedCache:
        weight: 10
---

SEED Cache support integrates the JCache API (a.k.a. JSR 107) which allows to interact with compliant caching providers
in a declarative or a programmatic way.

**Implementations are not provided by this support and must be configured depending on your caching solution**.

To enable the cache support in your application, use the following dependency snippet:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-cache-support</artifactId>
    </dependency>

JCache specification jar dependency is required as well since SEED cache support doesn't transitively provide this dependency:

    <dependency>
        <groupId>javax.cache</groupId>
        <artifactId>cache-api</artifactId>
        <version>1.0.0</version>
        <scope>provided</scope>
    </dependency>

The full specification PDF can be found [here](http://download.oracle.com/otn-pub/jcp/jcache-1_0-fr-eval-spec/JSR107FinalSpecification.pdf).