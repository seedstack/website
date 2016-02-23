---
title: "Finders"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - "query"
    - "data"
menu:
    BusinessManual:
        weight: 70
---

A Finder is an object that queries the domain to get lists of domain objects optionally matching some criteria. A Finder
queries the domain but returns representations.

Creating a Finder with the Business Framework, consists in:

* Creating a finder interface,
* Creating a finder implementation, located in the infrastructure as it depends upon a persistence technology.

Business Framework Finders are POJOs, there is no mandated interface. Just annotate your finder interface with the
`@Finder` annotation.

# Interface

Create the interface for your finder. A finder is annotated with `@Finder` and is declared as read only.

```
@Finder
public interface CustomerFinder {

    List<CustomerRepresentation> findAllCustomers();

}
```

# Implementation

In the infrastructure layer, provide the implementation (here with JPA):

```
public class CustomerJpaFinder implements CustomerFinder {

    @Inject
    private FluentAssembler assembler;

    @Override
    public List<CustomerRepresentation> findAllCustomer() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Customer> q = cb.createQuery(Customer.class);
        q.select(q.from(Customer.class));

        return fluentAssembler
                   .assemble(entityManager.createQuery(q).getResultList())
                   .to(CustomerRepresentation.class);
    }

}
```

