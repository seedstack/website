---
title: "Repository"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessRepository"
menu:
    BusinessRepository:
        weight: 10
---

A Repository is used to store and retrieve Aggregates from persistence. Aggregates are only manipulated by repositories
through their Aggregate roots.

{{% callout info %}}
This page describes how to implement **Repositories** with the Business framework. To know more about the Repository
concept, refer to [this section](../../concepts/domain-model/#repository).
{{% /callout %}}

# Usage

## Default repository

By default you don't have to create a repository. A default one is provided for all aggregate roots. This repository will
have the following methods:

- AGGREGATE **load**(KEY id)
- void **delete**(AGGREGATE aggregate)
- void **persist**(AGGREGATE aggregate)
- AGGREGATE **save**(AGGREGATE aggregate)
 
It can be injected with the generic interface `Repository` which take an aggregate and its key as generic parameters:

```
@Inject
private Repository<Customer, String> customerRepo;

Customer customer = customerRepo.load(customerId);
```

## Explicit repository

If the default repository doesn't fit your needs, you can create an explicit one. To do so using the Business framework
you must first create an interface which extends `GenericRepository`. This interface will be located in your Aggregate
package, along other domain objects belonging to this Aggregate. Then create an implementation class in the infrastructure
layer, using one of the four following options:

* Extend the `Base...Repository` class for a specific persistence technology (for instance `BaseJpaRepository` for creating
a JPA repository).
* Extend the `BaseRepository` class. You must implement the `doLoad()`, `doDelete()`, `doPersist()` and `doSave()` methods 
in this case.
* Implement the `Repository` interface. You must implement the `load()`, `delete()`, `persist()` and `save()` methods in 
this case.
* Simply annotate any class with the `@DomainRepository` annotation. In this case, you won't be able to use helpers and 
tools from the framework.

In all cases you must implement your Repository interface. With the three first options (technology-specific base class, 
base class and interface), you have to provide two generic parameters with respectively the type of the Aggregate root 
and the type of the Aggregate root identifier.

An explicit repository can be injected like a default one (with the `Repository` interface) or with its own interface:

```
@Inject
private Repository<Order, Long> repository;
```
```
@Inject
private OrderRepository repository;
```

# Custom methods 

If you need additional methods, you must have an explicit repository. This explicit repository can then be augmented by
adding methods to the repository interface and implement them in the repository implementation. 

## Repository Interface

A repository interface has to extend `GenericRepository` interface to be taken into account by SEED.

```
import org.seedstack.business.api.domain.Repository;

public interface OrderRepository extends GenericRepository<Order, Long> {
}
```
