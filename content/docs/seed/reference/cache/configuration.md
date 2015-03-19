---
title: "Configuration"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedCache"
tags:
    - "cache"
    - "configuration"
menu:
    SeedCache:
        weight: 20
---

You must define the cache(s) you will use in your application in the configuration:

    [org.seedstack.seed.cache]
    caches = myCache1, myCache2, ...
    
You can then further configure each cache specifically by using the `org.seedstack.seed.cache.cache` prefix followed by
the cache name:

    [org.seedstack.seed.cache.cache.myCache1]
    ...
    
# Cache provider
    
If you have exactly one compliant cache provider in the classpath, it will be automatically picked by the cache support. 
Otherwise you must specify which provider to use for each cache:
  
    [org.seedstack.seed.cache.cache.myCache1]
    provider = fully.qualified.classname.of.caching.Provider  
    
You can also specify a global default provider, which will be picked for every cache without an explicitly specified
provider:

    [org.seedstack.seed.cache]
    default-provider = fully.qualified.classname.of.default.caching.Provider

    
# Expiry policy factory

You can specify a custom expiry policy factory for each cache:

    [org.seedstack.seed.cache]
    expiry-policy-factory = fully.qualified.classname.of.expiry.policy.Factory

An expiry policy factory must implement `javax.cache.configuration.Factory<javax.cache.expiry.ExpiryPolicy>`.
  