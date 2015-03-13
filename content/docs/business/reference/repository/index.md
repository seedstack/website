---
title: "Repository"
type: "reference"
zones:
    - "Business"
sections:
    - "BusinessRepository"
menu:
    BusinessRepository:
        weight: 10
---

A repository is used to manipulate aggregates in a CRUD manner from its aggregate root.

# Default repository

By default you don't have to create a repository. A default one is provided for all aggregate roots. This repository will
have the following methods:

- AGGREGATE **load**(KEY id)
- void **delete**(AGGREGATE aggregate)
- void **persist**(AGGREGATE aggregate)
- AGGREGATE **save**(AGGREGATE aggregate)
 
It can be injected with the generic interface `Repository` which take an aggregate and its key as TypeVariable:

```
@Inject
private Repository<Customer, String> customerRepo;

Customer customer = customerRepo.load(customerId);
```

# Custom Repository 

If you need additional methods, you can still create a custom repository. In order to do that, you have to create
an interface which will be located in your aggregate package and an implementation which will be located in the 
infrastructure layer. Custom repository can be injected in the same way as default repository through the generic 
Repository interface or through your own interface, as describe above.

```
@Inject
private Repository<Order, Long> repository;
```
```
@Inject
private OrderRepository repository;
```

## Repository Interface

A repository interface has to extend `GenericRepository` interface to be taken into account by SEED.

```
import org.seedstack.business.api.domain.Repository;

public interface OrderRepository extends GenericRepository<Order, Long> {
}
```

## Repository implementation

A repository implementation has to implement its interface and extend one of the following classes:

- *seed-business-jpa* provides `GenericJpaRepository`
- *seed-business-core* provides `InMemoryRepository` (eg. for test purpose)	

```
import org.seedstack.business.jpa.infrastructure.repository.GenericJpaRepository;
import org.mycompany.myapp.domain.order.Order;
import org.mycompany.myapp.domain.order.OrderRepository;

public class OrderJpaRepository extends GenericJpaRepository<Order, Long> 
        implements OrderRepository {
}
```

- `OrderJpaRepository` repository implements its `OrderRepository` interface and extends `GenericJpaRepository<Order, Long>` which provides all the necessary behaviour. 
- Only additional *custom methods* would have required an implementation.
- notice the **infrastructure** package of this implementation 

# Repository - advanced

If `GenericJpaRepository` and `InMemoryRepository` doesn't fit your needs you can still extends `BaseRepository`. And provide
your implementation for the default methods. Even if it is obviously easier to just extend one of provided `BaseRepository`.