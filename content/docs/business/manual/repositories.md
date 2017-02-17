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

A repository is a pattern used to store and retrieve Aggregates from persistence with a **simple and global interface**,
providing the illusion of an in-memory collection. A repository manipulates a whole aggregate through its aggregate 
root and ensures that it is persisted and retrieved in a coherent manner.<!--more-->

# Default repository

The Business Framework provides a default repository that can perform CRUD actions on an aggregate.
It can be injected with the `Repository` interface and a qualifier.

```
public class SomeClass {
    @Inject @Jpa
    private Repository<Customer, String> customerRepo;
    
    public void someMethod() {
        Customer customer = customerRepo.load(customerId);
        // ...
    }
}
```

{{% callout info %}}
By default, you have to explicitly specify the qualifier. But you can choose to configure a default repository using 
[class configuration]({{< ref "docs/seed/configuration.md#class-configuration" >}}):

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

# Custom repository

The default CRUD repository is interesting to start quickly and might be enough for some use cases. But it is possible to 
add your own repositories, in order to extend the CRUD behavior with your domain
requirements.


First create a repository interface extending `GenericRepository`. This interface is usually located in the aggregate package.

```java
public interface OrderRepository extends GenericRepository<Order, Long> {
     Order findOrderByCategory(String categoryId);
}
```

{{% callout info %}}
It is possible not to use the `GenericRepository` interface and instead annotate the class with the `@DomainRepository` annotation.
But you won't be able to use the framework's helpers like the assembler DSL `fromRepository()` method.
{{% /callout %}}

Then add an implementation in the infrastructure layer.

```java
public class OrderJpaRepository extends BaseJpaRepository<Order, Long> implements OrderRepository {
    @Override
    public Order findOrderByCategory(String categoryId){ 
        // ... 
    }
}
```

# Usage

An explicit repository can be injected like a default one (with the `Repository` interface):

```
@Inject
private Repository<Order, Long> repository;
```

Or with its own interface:

```
@Inject
private OrderRepository repository;
```
