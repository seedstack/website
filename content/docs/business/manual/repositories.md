---
title: "Repositories"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - "repository"
    - "pattern"
    - "aggregate"
    - "lifecycle"
    - "persistence"
menu:
    BusinessManual:
        weight: 40
---

{{% callout def %}}
**A repository is responsible for consistently storing and retrieving a whole aggregate.<br> 
It has a simple collection-like global interface and optionally domain-specific methods.**
{{% /callout %}}

# Characteristics

## Manipulates whole aggregates

A repository is responsible for storing and retrieve a whole aggregate. It manipulates the aggregate through its root 
entity. It cannot directly store or retrieve parts of the aggregate.

## Illusion of in-memory collection

A repository provides the illusion of an in-memory collection of all objects that are of the corresponding aggregate 
root type.

## Well-known interface

A repository implements a well-known interface that provides methods for adding, removing and querying objects.
  
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

    // Optional business-meaningful methods  
    List<SomeAggregate> objectsByCategory(String category);
}
```
{{% callout info %}}
This interface should be placed in the corresponding aggregate package.
{{% /callout %}}

Then implement the interface in a class. Depending upon the persistence technology, SeedStack may provide base 
implementations for the common interface. It is recommended you extend them if possible. In the case of JPA:  
  
```java
public class SomeJpaRepository extends BaseJpaRepository<SomeAggregate, SomeId> 
                               implements SomeRepository {

    @Override
    public List<SomeAggregate> objectsByCategory(String category) {
        // implement specific query
    }
}
```  

{{% callout warning %}}
A repository implementation almost always depend upon a specific technology or library, so the implementation should be
put in the infrastructure layer, in a sub-package named after the corresponding technology (in this case `[base.package].infrastructure.jpa`).
{{% /callout %}}

{{% callout info %}}
Information about how to use various persistence technologies with the business framework can be found in the corresponding 
persistence add-on documentation.
{{% /callout %}}

## Usage

To use your repository, simply [inject it]({{< ref "docs/seed/dependency-injection.md" >}}) where required: 

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


# Default repository

If the common repository interface is enough for your needs, you can avoid writing any repository code and rely on the
default repositories instead. For each supported persistence technology and each aggregate, the business framework can 
provide a default repository implementation.

## Usage

Just inject the qualified {{< java "org.seedstack.business.domain.Repository" >}} interface. In the case of JPA:
    
```java
public class SomeClass {
    @Inject
    @Jpa
    private Repository<SomeAggregate, SomeId> someAggregateRepository;
    
    public void someMethod() {
        SomeAggregate someAggregate = someAggregateRepository.load(new SomeId("John Doe"));
    }
}
```

{{% callout info %}}
See the persistence add-ons documentation to learn if a default repository is provided for a specific persistence and how
to use it.
{{% /callout %}}

{{% callout tips %}}
By default, you have to explicitly specify the qualifier (`@Jpa` in the example above). But you can choose to configure 
a default repository instead, using [class configuration]({{< ref "docs/seed/configuration.md#class-configuration" >}}):

```yaml
classes:
  org:
    myorg:
      myapp:
        domain:
          model:
            # JPA will be used for all aggregates... 
            defaultRepository: org.seedstack.jpa.Jpa
            someaggregate:
              # ... except for this one, using MongoDb Morphia
              defaultRepository: org.seedstack.mongodb.morphia.Morphia
```

The `defaultRepository` property expects a qualifier annotation class or a string when using named qualifiers (eg. `@Named("someQualifier")`).
{{% /callout %}}

# Example

The repository interface:

```java
public interface ProductRepository extends Repository<Product, ProductId> {
  
    List<Product> discontinuedProducts();    
}
```

And its JPA implementation:

```java
public class ProductJpaRepository extends BaseJpaRepository<Product, ProductId> implements ProductRepository {
    
    @Override
    public List<Product> discontinuedProducts() {
        EntityManager entityManager = getEntityManager();
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        
        CriteriaQuery<Product> cq = cb.createQuery(Product.class);
        Root<Product> root = cq.from(Product.class);
        cq.where(cb.isTrue(root.get("discontinued")));
        
        return entityManager.createQuery(cq).getResultList();
    }    
}
```

