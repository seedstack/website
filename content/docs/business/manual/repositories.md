---
title: "Repositories"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - domain-driven design
    - persistence
menu:
    BusinessManual:
        weight: 40
---

{{% callout def %}}
**A repository is responsible for consistently storing and retrieving a whole aggregate.<br> 
It has a simple collection-like global interface and optionally domain-specific methods.**
{{% /callout %}}
<!--more-->

# Characteristics

## Manipulates whole aggregates

A repository is responsible for storing and retrieve a whole aggregate. It manipulates the aggregate through its root. 
It cannot directly store or retrieve parts of the aggregate.

## Illusion of in-memory collection

A repository provides the illusion of an in-memory collection of all objects that are of the corresponding aggregate 
root type.

## Well-known interface

A repository implements a well-known interface that provides methods for adding, removing and querying objects. In the 
business framework this is the {{< java "org.seedstack.business.domain.Repository" >}} interface.
  
## Domain-specific methods

A repository optionally implements methods that select objects based on criteria meaningful to domain experts. Those
methods return fully instantiated objects or collections of objects whose attribute values meet the criteria. 

# Explicit repository

## Declaration

To declare a repository with the business framework, create an interface extending {{< java "org.seedstack.business.domain.Repository" >}}.
By extending this interface, your repository is inheriting the common interface for all repositories. You may add your
own methods for retrieving aggregate instances based on meaningful business criteria:
 
```java
public interface SomeRepository extends Repository<SomeAggregate, SomeId> {
    List<SomeAggregate> objectsForCategory(String category);
}
```

Then implement the interface in a class. Depending upon the persistence technology, SeedStack may provide base 
implementations for the common interface. It is recommended to extend them if possible. In the case of an in-memory repository:  
  
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

{{% callout warning %}}
A repository implementation almost always depend upon a specific technology or library, so the implementation should be
put in the infrastructure layer, in a sub-package named after the corresponding technology (in this case `[base.package].infrastructure.inmemory`).
{{% /callout %}}

{{% callout info %}}
Information about how to use various persistence technologies with the business framework can be found in the corresponding 
persistence add-on documentation.
{{% /callout %}}

## Usage

To use your repository, [inject]({{< ref "docs/seed/dependency-injection.md" >}}) its interface: 

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

{{% callout info %}}
By default, repositories are instantiated each time they are injected, avoiding the risk to wrongly keep an internal state 
between uses. In some cases, after having well considered the issue, you can choose to make your repository a singleton by
annotating the repository implementation with {{< java "javax.inject.Singleton" "@" >}}.
{{% /callout %}}

# Generated repository

If you only define a repository interface (without implementation), the business framework will generate one or more 
implementation(s).

## Declaration

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

For each persistence technology that supports it (like in-memory, JPA, MongoDB Morphia), the business framework will 
generate an implementation of this interface.

## Usage

To use the generated repository, [inject]({{< ref "docs/seed/dependency-injection.md" >}}) the custom interface. A qualifier 
corresponding to the required implementation must be specified at the injection point:

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

{{% callout info %}}
See the [add-ons library]({{< baseUrl >}}addons) to discover the available persistence technologies supporting 
generated repositories.
{{% /callout %}}

# Default repository

For aggregates without any defined repository (neither interface nor implementation), the business framework will provide 
one or more default implementation of the {{< java "org.seedstack.business.domain.Repository" >}} interface.  

## Declaration

No declaration is needed. For each persistence technology that supports it (like in-memory, JPA, MongoDB Morphia), a 
default implementation will be provided.

## Usage

To use the default repository, [inject]({{< ref "docs/seed/dependency-injection.md" >}}) the typed {{< java "org.seedstack.business.domain.Repository" >}}
interface. A qualifier corresponding to the chosen implementation must be specified at the injection point:  

```java
public class SomeClass {
    @Inject
    @InMemory
    private Repository<SomeAggregate, SomeId> someAggregateRepository;
    
    public void someMethod() {
        SomeAggregate someAggregate = someAggregateRepository.get(new SomeId("John Doe"))
            .orElseThrow(() -> new AggregateNotFoundException("John Doe not found"));
    }
}
```

{{% callout info %}}
See the [add-ons library]({{< baseUrl >}}addons) to discover the available persistence technologies supporting 
default repositories.
{{% /callout %}}

## Class configuration

When using default or generated repositories you have to explicitly specify the qualifier at the injection point, to choose
the correct implementation. 

To avoid specifying the qualifier in code, you can specify it as the `defaultRepository` key in 
[class configuration]({{< ref "docs/seed/configuration.md#class-configuration" >}}):

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

# Example

## Explicit repository

The repository interface:

```java
public interface ProductRepository extends Repository<Product, ProductId> {
  
    List<Product> discontinuedProducts();    
}
```

And its JPA implementation:

```java
public class ProductJpaRepository 
        extends BaseJpaRepository<Product, ProductId> 
        implements ProductRepository {
    
    @Override
    public List<Product> discontinuedProducts() {
        // JPA implementation of the query 
    }    
}
```

## Generated repository

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

## Default repository

Nothing to declare but only have access to {{< java "org.seedstack.business.domain.Repository" >}} methods.
