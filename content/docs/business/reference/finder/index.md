---
title: "Finder"
type: "reference"
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

# Finder interface

Create the interface for your finder. A finder is annotated with `@Finder` and is declared as read only.

```
@Finder
public interface CustomerFinder {

	List<CustomerRepresentation> findAllCustomers();

	CustomerRepresentation findCustomerById(long value);
}
```

# Finder implementation

In the infrastructure layer, provide the implementation (here with JPA)

```
public class CustomerJpaFinder implements CustomerFinder {

	@Inject
	private CustomerAssembler assembler;

	@Override
	public List<CustomerRepresentation> findAllCustomer() {
	    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Customer> q = cb.createQuery(Customer.class);
        Root<Customer> c = q.from(Customer.class);
        q.select(c);
        List<Customer> customers = entityManager.createQuery(q).getResultList();
        
        List<CustomerRepresentation> customerRepresentations = 
            new ArrayList<CustomerRepresentation>(customers.size());
        for (Customer customer : customers) {
            customerRepresentations.add(customerAssembler.assembleDtoFromAggregate(customer));
        }
        return customerRepresentations;
	}

	@Override
	public CustomerRepresentation findCustomerById(long value) {
		Order order = aggregateManager.find(Order.class, value);
		return (order == null ? null : assembler.assembleDtoFromAggregate(order));
	}
}
```