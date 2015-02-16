---
title: "Usage"
zones:
    - "Seed"
sections:
    - "SeedCache"
menu:
    SeedCache:
        weight: 30
---

The JCache specification provides an annotation-based declarative API and a programmatic API.
  
# Declarative API

The declarative API is annotation-based and can be used on methods. When the method will be invoked, the corresponding
cache operation will take place.

## Cache a return value

The following code caches the return value of the method, using its arguments as a key:

    @CacheResult(cacheName = "things")
    public Thing getThing(String scope, String name) {
        ...
    }
    
Keys generation can be customized using the `CacheKeyGenerator` interface. If no specific implementation is specified, 
the default implementation, per spec, takes all parameters unless one or more parameters are annotated with the @CacheKey 
annotation, in which case only those are used:
    
    @CacheResult(cacheName = "things")
    public Thing getThing(@CacheKey String scope, @CacheKey String name, Date timestamp) {
        ...
    }
    
`@CacheResult` brings the concept of exception cache: whenever a method execution failed, it is possible to cache the 
exception that was raised to prevent calling the method again.

JCache has the notion of `CacheResolver` which permits to resolve the cache to use at runtime.
 
    @CacheResult(cacheName = "things", cacheResolverFactory = MyCacheResolverFactory.class)
    public Thing getThing(@CacheKey String scope, @CacheKey String name, Date timestamp) {
        ...
    }
    
Finally, `@CacheResult` has a skipGet attribute that can be enabled to always invoke the method regardless of the status 
of the cache. This is useful for create or update methods that should always be executed and have their returned value 
placed in the cache.

## Put a value

The following code add `updatedThing` to the `things` cache with the `scope` and `name` arguments as the key:

    @CachePut(cacheName = "things")
    public void updateThing(String scope, String name, @CacheValue updatedThing) {
        ...
    }

`@CacheValue` annotated parameters are automatically excluded from key generation.

As for `@CacheResult`, `@CachePut` allows to manage any exception that is thrown while executing the method, preventing the 
put operation to happen if the thrown exception matches the filter specified on the annotation.

Finally, it is possible to control if the cache is updated before or after the invocation of the annotated method. Of 
course, if it is updated before, no exception handling takes place.

## Remove a value

The following code remove the entry with the `scope` and `name` arguments as the key from the `things` cache:

    @CacheRemove(cacheName = "things")
    public void deleteThing(String scope, String name) {
        ...
    }
    
`@CacheRemove` has a special exception handling to prevent the eviction if the annotated method throws an exception that 
matches the filter specified on the annotation.

## Remove all values

The following code remove all entries from the `things` cache:

    @CacheRemoveAll(cacheName = "things")
    public void clearAllThings() {
        ...
    }

## Cache defaults

`@CacheDefaults` is a class-level annotation that allows you to share common settings on any caching operation defined 
on the class. These are:

* The name of the cache
* The custom CacheResolverFactory
* The custom CacheKeyGenerator
    
# Programmatic API

If you need a more fine-grained control of your caches, you can also use the programmatic API. You just need to inject
the needed `Cache` object(s):

    @Inject @Named("things")
    private Cache thingsCache;
    
Please check the JavaDoc of the `javax.cache.Cache` interface for more information.
