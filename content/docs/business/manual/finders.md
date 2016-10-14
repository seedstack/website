---
title: "Finders"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - "query"
    - "pattern"
    - "data"
    - "finder"
menu:
    BusinessManual:
        weight: 90
---

The role of a finder is to query the persistence layer or any data source to obtain objects specific to an interface of 
the application. It only does **read-only** operations and is NOT meant to replace the repository as it doesn't produce 
domain objects but interface-specific objects like REST representations.<!--more-->

{{% callout info %}}
A finder shouldn't generally delegate its data retrieval to the domain repository. Instead it should directly issue the most efficient query against the persistence layer and construct DTO objects, completely bypassing the domain. Consider the following implications:

* You should write as many finders as required by your application interfaces.
* You can query a model completely different from your domain model and optimized for reading purposes (i.e. a read model) or not model at all.
* You can rely on a completely different technology than the domain persistence, like an high-performance index.
{{% /callout %}}

{{% callout tips %}}
Don't create finders needlessly: if your data retrieval needs are simple enough to not require a finder, just use the domain repositories directly in your interface and transform the retrieved domain objects to DTO with assemblers.
{{% /callout %}}

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

