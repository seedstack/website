---
title: "Entity"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessEntity"
menu:
    BusinessEntity:
        weight: 10
---

{{% callout info %}}
This page describes how to implement Entities with the Business framework. To know more about the Entity concept, refer
to [this section](../../concepts/domain-model/#entity).
{{% /callout %}}

# Usage

In order to create an entity, you must extend the `BaseEntity` class. It will require you to implement the `getEntityId()` 
method which returns the identity of the class.

```java
public class Customer extends BaseEntity {

    private CustomerId customerId;

    private Address address;

    private String email;

    private List<Order> orders;

    /* Package protected constructor */
    Customer (CustomerId identity, Address address, String email) {
        this.customerId = identity;
        ...
    }

    @Override
    public CustomerId getEntityId() {
        return this.customerId;
    }

    /* Meaningful methods */
    public void changeAddress(Address address) { ... }
    public void changeEmail(String email) { ... }
    public void buyItem(Order order) { ... }

    /* Getters */
    public Address getAddress() { ... }
    public Address getEmail() { ... }
    public Address getOrders() { ... }
}
```
