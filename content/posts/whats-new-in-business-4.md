---
title: "What's new in business framework 4.0 ?"
description: Discover the new features of the new business framework 4.0...
authors:
  - Adrien LAUER
date: 2017-12-06
tags:
  - release
zones:
  - Posts
---

Business framework 4.x is vastly improved version. DDD specifications, simpler API, powerful pagination, stream-based
implementation, ...<!--more--> 

Discover the details below!   

## Specifications

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

## New pagination API

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

## In-memory repository

An in-memory repository implementation is built-in for tests and demonstration-purposes.

```java
public class SomeClass {
    @Inject
    @InMemory
    private Repository<Product, Long> repository;
}
```  

## Overriding implementations

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
