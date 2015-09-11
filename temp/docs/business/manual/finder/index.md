---
title: "Finder"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessFinder"
menu:
    BusinessFinder:
        weight: 10
---

A Finder is an object that queries the domain to get lists of domain objects matching some criteria. A Finder queries 
the domain but returns representations. Don't hesitate to create several finders for each representations.

# Usage

Creating a Finder with the Business Framework, consists in:

* Creating a finder interface,
* Creating a finder implementation, located in the infrastructure as it depends upon a persistence technology.

Business Framework Finders are POJOs, there is no mandated interface. Just annotate your finder interface with the
`@Finder` annotation.

# Finder interface

Create the interface for your finder. A finder is annotated with `@Finder` and is declared as read only.

```
@Finder
public interface CustomerFinder {

    List<CustomerRepresentation> findAllCustomers();

}
```

# Finder implementation

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