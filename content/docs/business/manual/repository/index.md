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

A Repository is used to store and retrieve Aggregates from persistence.
Aggregates are only manipulated by repositories through their Aggregate roots.

{{% callout info %}}
This page describes how to implement **Repositories** with the Business framework.
To know more about the Repository concept, refer to [this section](../../concepts/domain-model/#repository).
{{% /callout %}}

# Default repository

The Business Framework provides a default repository that can perform CRUD actions on an aggreate.
It can be injected with the `Repository` interface and a qualifier.

```
@Inject @Jpa
private Repository<Customer, String> customerRepo;

...
Customer customer = customerRepo.load(customerId);
```

{{% callout info %}}
By default, you have to explicitly specify the qualifier.
But if you have only one persistence and one default repository, you can configure the one to use.
The default repository can be configured for all the application:

```
[org.example.*]
default.repository.qualifier=org.seedstack.seed.persistence.jpa.api.Jpa
```

And then overriden for a specific aggregate root:

```
[org.example.domain.customer.Customer]
default.repository.qualifier=another-qualifier
```

The `default.repository.qualifier` property expects a qualifier annotation class or a string when the qualifier use `@Named("another-qualifer")`.
{{% /callout %}}

# Explicit repository

The default CRUD repository is interesting to start quickly and might be enough for some use cases.
But it is possible to add your own repositories, in order to extend the CRUD behavior with your domain
requirements.

## Repository Interface

First create a repository interface extending `GenericRepository`.
This interface is usually located in the aggregate package.

```
import org.seedstack.business.api.domain.Repository;

public interface OrderRepository extends GenericRepository<Order, Long> {

     Order findOrderByCategory(String categoryId)
}
```

{{% callout info %}}
It is possible not to use the `GenericRepository` interface and instead annotate the class with the `@DomainRepository` annotation.
But you won't be able to use the framework's helpers like the assembler DSL `fromRepository()` method.
{{% /callout %}}

## Repository implementation

Then add an implementation in the infrastructure layer.

```
public class OrderJpaRepository extends BaseJpaRepository<Order, Long> implements OrderRepository {

    @Override
    public Order findOrderByCategory(String categoryId){ ... }
}
```

## Usage

An explicit repository can be injected like a default one (with the `Repository` interface) or with its own interface:

```
@Inject
private Repository<Order, Long> repository;
```

```
@Inject
private OrderRepository repository;
```
