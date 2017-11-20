---
title: "Repositories"
type: "home"
zones:
    - "Docs"
tags:
    - domain-driven design
    - persistence
menu:
    docs:
        parent: "business"
        weight: 21
---

{{% callout def %}}
**A repository is responsible for consistently storing and retrieving a whole aggregate.<br> 
It has a simple collection-like global interface and optionally domain-specific methods.**
{{% /callout %}}
<!--more-->

## Characteristics

### Manipulates whole aggregates

A repository is responsible for storing and retrieve a whole aggregate. It manipulates the aggregate through its root. 
It cannot directly store or retrieve parts of the aggregate.

### Illusion of in-memory collection

A repository provides the illusion of an in-memory collection of all objects that are of the corresponding aggregate 
root type.
    
### Well-known interface

A repository implements a well-known interface that provides methods for adding, removing and querying objects. In the 
business framework this is the {{< java "org.seedstack.business.domain.Repository" >}} interface.
  
### Domain-specific methods

A repository optionally implements methods that select objects based on criteria meaningful to domain experts. Those
methods return fully instantiated objects or collections of objects whose attribute values meet the criteria. 

## Default repository

The business framework provides a default repository for each aggregate that does not already have a [generated](#generated-repository) 
or a [custom](#custom-repository) repository. The {{< java "org.seedstack.business.domain.Repository" >}} interface provides

* CRUD methods to manipulate an aggregate, 
* Technology-agnostic querying capabilities using [specifications]({{< ref "docs/business/specifications.md" >}}).

### Usage

To use a default repository, [inject]({{< ref "docs/basics/dependency-injection.md" >}}) the {{< java "org.seedstack.business.domain.Repository" >}} 
interface with the aggregate and its identifier types as generic parameters. Qualify the injection point to select an 
implementation. Example:

```java
public class SomeClass {
    @Inject
    @InMemory
    private Repository<SomeAggregate, SomeAggregateId> someAggregateRepository;
    
    public void someMethod() {
        // manipulate aggregates with generic methods
    }
}
```

{{% callout tips %}}
In the example above the {{< java "org.seedstack.business.util.inmemory.InMemory" "@" >}} qualifier selects the built-in 
in-memory implementation. Other implementations are available in some [persistence add-ons]({{< baseUrl >}}addons?f=persistence).
{{% /callout %}}

## Generated repository

Good domain-driven design requires that repositories provides business-meaningful methods to retrieve aggregates. 

In SeedStack, this can be done in a technology-agnostic way by creating an interface extending {{< java "org.seedstack.business.domain.Repository" >}}.
The business framework then generates an implementation of this custom interface for each persistence technology that supports it.  

### Declaration

Create an interface extending {{< java "org.seedstack.business.domain.Repository" >}} and add custom methods to this 
interface. Implement them directly in the interface in a technology-agnostic manner:

```java
public interface SomeRepository extends Repository<SomeAggregate, SomeId> {
    default List<SomeAggregate> objectsForCategory(String category) {
        return get(getSpecificationBuilder().of(SomeAggregate.class)
                .property("category").is(category)
                .build()
        );
    }
}
```

{{% callout tips %}}
[Specifications]({{< ref "docs/business/specifications.md" >}}) allow to write complex queries with 
technology-agnostic code. The business framework will automatically translate the specification into a real query and
execute it. 
{{% /callout %}}

### Usage

To use the generated repository, [inject]({{< ref "docs/basics/dependency-injection.md" >}}) the custom interface. Qualify 
the injection point to select an implementation.

```java
public class SomeClass {
    @Inject
    @InMemory
    private SomeRepository someRepository;
    
    public void someMethod() {
        List<SomeAggregate> list = someRepository.objectsForCategory("cat1");
    }
}
```  

{{% callout tips %}}
In the example above the {{< java "org.seedstack.business.util.inmemory.InMemory" "@" >}} qualifier selects the in-memory 
generated implementation. Other implementations are available in some [persistence add-ons]({{< baseUrl >}}addons?f=persistence).
{{% /callout %}}

## Custom repository

Sometimes you just need to write your own technology-specific implementation for flexibility or performance reasons. In
that case you have to write a custom interface extending {{< java "org.seedstack.business.domain.Repository" >}} and a 
custom implementation.  

### Declaration

To create an explicit repository, create an interface extending {{< java "org.seedstack.business.domain.Repository" >}}:
 
```java
public interface SomeRepository extends Repository<SomeAggregate, SomeId> {
    List<SomeAggregate> objectsForCategory(String category);
}
```

Then implement the interface in a class. To avoid reimplementing methods defined in the {{< java "org.seedstack.business.domain.Repository" >}}
interface, you must extend the base implementation provided by SeedStack:  
  
```java
public class SomeInMemoryRepository 
        extends BaseInMemoryRepository<SomeAggregate, SomeId> 
        implements SomeRepository {

    @Override
    public List<SomeAggregate> objectsByCategory(String category) {
        // implement specific query
    }
}
```  

{{% callout tips %}}
In the example above, the custom implementation extends the {{< java "org.seedstack.business.util.inmemory.BaseInMemoryRepository" >}} 
base class which provides in-memory implementation for generic methods. Other base implementations to extend are 
available in some [persistence add-ons]({{< baseUrl >}}addons?f=persistence).
{{% /callout %}}

### Usage

To use the explicit repository, [inject]({{< ref "docs/basics/dependency-injection.md" >}}) the custom interface: 

```java
public class SomeClass {
    @Inject
    private SomeRepository someRepository;
    
    public void someMethod() {
        List<SomeAggregate> stream = someRepository.objectsByCategory("category1");
        // do something with the result
    }
}
```

## Querying by specification

Business framework repositories offer several methods that accept [specifications]({{< ref "docs/business/specifications.md" >}}).
Querying by specification offers the ability to **write complex business queries without any coupling to the underlying
persistence technology**. 

The following methods take a specification parameter:

* `get()`: returns a {{< java "java.util.stream.Stream" >}} of aggregates matching the given specification.
* `remove()`: removes only the aggregates matching the given specification.
* `contains()`: returns true if at least one aggregate in the repository matches the given specification.  
* `count()`: returns the number of aggregates matching the given specification.  

{{% callout info %}}
For maximum efficiency, specifications are translated into technology-specific queries by SeedStack repository 
implementations, maintaining good performance.
{{% /callout %}}

## Class configuration

When using default or generated repositories you have to explicitly specify the qualifier at the injection point, to choose
the correct implementation. 

To avoid specifying the qualifier in code, you can specify it as the `defaultRepository` key in 
[class configuration]({{< ref "docs/core/configuration.md#class-configuration" >}}):

```yaml
classes:
  org:
    myorg:
      myapp:
        domain:
          model:
            someaggregate:
              defaultRepository: org.seedstack.business.util.inmemory.InMemory
```

{{% callout info %}}
The `defaultRepository` property expects either: 

* A qualifier annotation class name (like {{< java "org.seedstack.business.util.inmemory.InMemory" "@" >}}),
* Or an arbitrary string which will be used as the parameter of the {{< java "javax.inject.Named" "@" >}} qualifier.
{{% /callout %}}

## Example

### Default repository

Nothing to declare but only have access to {{< java "org.seedstack.business.domain.Repository" >}} methods.

### Generated repository

```java
public interface ProductRepository extends Repository<Product, ProductId> {
    default List<Product> discontinuedProducts() {
        return get(getSpecificationBuilder().of(Product.class)
                .property("discontinued").equalTo(true)
                .build()
        );
    }
}
```

### Explicit repository

The repository interface:

```java
public interface ProductRepository extends Repository<Product, ProductId> {
     List<Product> discontinuedProducts();    
}
```

And its in-memory implementation:

```java
public class ProductJpaRepository 
        extends BaseInMemoryRepository<Product, ProductId> 
        implements ProductRepository {   
    @Override
    public List<Product> discontinuedProducts() {
        // in-memory implementation of the query 
    }    
}
```
