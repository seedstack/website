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

Entities are used to represent a domain concept which has an identity.

{{% callout info %}}
This page describes how to implement **Entities** with the Business framework. To know more about the Entity concept, refer
to [this section](../../concepts/domain-model/#entity).
{{% /callout %}}

# Usage

To create an Entity using the Business framework you have three choices:

* Extend the `BaseEntity` class. The `equals()`, `hashCode()` and `compareTo()` methods will be provided out-of-the-box. You
must implement the `getEntityId()` method.
* Implement the `Entity` interface. You must implement the `equals()`, `hashCode()`, `compareTo()` and `getEntityId()` 
methods in this case.
* Simply annotate any class with the `@DomainEntity` annotation. In this case, you won't be able to use helpers and 
tools from the framework.

With the two first options (base class and interface), you have to provide a generic parameter with the type of the
Entity identifier.

# Example

Consider the following example in which a `Customer` Entity is identified by an e-mail of String type. 

```
public class Customer extends BaseEntity<String> {
    private String email;
    private Address address;
    private List<Order> orders;

    /* Package protected constructor */
    Customer (String identity, Address address) {
        this.email = identity;
        ...
    }

    @Override
    public String getEntityId() {
        return this.email;
    }

    /* Meaningful methods */
    public void changeAddress(Address newAddress) { ... }

    /* Getters */
    public Address getAddress() { ... }
    public String getEmail() { ... }
    public List<Order> getOrders() { ... }
    
    /* Try to avoid setters as they allow to alter the internal state of the entity */
}
```
