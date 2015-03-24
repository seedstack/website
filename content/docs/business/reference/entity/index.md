---
title: "Entity"
type: "reference"
zones:
    - "Business"
sections:
    - "BusinessEntity"
menu:
    BusinessEntity:
        weight: 10
---

# Usage

In order to create an entity extends the `BaseEntity` class. It will
require you to implement the `getEntityId()` method which returns the
identity of the class.

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

# Configuration SPI

SEED Business Framework provides an `EntityConfigurationService` allowing to retrieve a specific set of properties for 
entities. This service follows specific semantics and rules that are detailed below.
Below are possible syntaxes using entity props configuration :

```
[*]
[org.mycompany.*]
[org.mycompany.myapp.mydomain1.*]
[org.mycompany.mapp.mydomain1.MyEntity1]
```

* First  `[*]` section refers to all packages. Therefore properties would apply to all entities.
* Second `[org.mycompany.*]` section refers to all packages starting with `org.mycompany.`. Therefore properties would apply
to all entities within that scope.
* Third  `[org.mycompany.myapp.mydomain1.*]` section refers to all packages starting with `org.mycompany.myapp.mydomain1.`.
Therefore properties would apply to all entities within **domain1**.
* Fourth `[org.mycompany.myapp.mydomain1.MyEntity1]` section refers to `MyEntity1` within **domain1**. Therefore properties
would only apply to this entity.

Please refer to [props configuration](#!/seed-doc/core/configuration) for details on sections.
