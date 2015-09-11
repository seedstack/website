---
title: "Factory"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessFactory"
menu:
    BusinessFactory:
        weight: 10
---

A factory is used to **create domain objects**, checking that provided data is complete and consistent.

{{% callout info %}}
This page describes how to implement **Factories** with the Business framework. To know more about the Factory
concept, refer to [this section](../../concepts/domain-model/#factory).
{{% /callout %}}

To be created by a factory the domain object must also implements `Producible`. This is necessary because all
the domain objects are not producible by a factory. For instance an entity is only be producible by an aggregate
root.

The types implementing `DomainObject` and `Producible` are the followings:

* AggregateRoot, 
* DomainPolicy,
* ValueObject,
* DomainEvent,
* DomainService.
 
# Usage
 
## Default factory

The default factory has a single method `create` with varargs that will match via reflection the constructor corresponding 
to the passed arguments. As other factories this method will provide validation on the created object. But it won't 
survive to refactoring, so be careful using the method (ie. unit test it!).
 
```
@Inject
Factory<Customer> factory;

Customer customer = factory.create("John", "Doe");
```
 
```
public class Customer implements BaseAggregate {
    Customer() {
    }
    
    Customer(String firstName, String lastName) { // This constructor will be called
        ...
    }
}
```

This factory can only be used to create producible domain objects. So classes such as policies and domain services
which are only marked by an annotation should also implements `Producible` and `DomainObject` interfaces.
Or you can use the generic interfaces `GenericDomainPolicy` and `GenericDomainService` instead of the annotation.

```
@Policy
public interface MyPolicy implements DomainObject {
}
```

## Explicit factory

An explicit factory is composed of an interface, which is located in the aggregate package, and an implementation which can
be located either:

* In the aggregate package,
* Or in an infrastructure if it is dependent upon a specific technology (rare case).

### Factory interface

A factory interface has to extend the `GenericFactory` interface.

```
package org.mycompany.myapp.domain.model.order;

import org.javatuples.Triplet;
import org.seedstack.business.api.domain.GenericFactory;

public interface OrderFactory extends GenericFactory<Order> {

    Order createOrder(String customerId, Date checkoutDate, Double price, 
            List<Triplet<Integer, Double, Long>> orderItemTriplets);
}
```

- `Order` is the type which is the expected to be returned by all the create methods.
- `createOrder` method creates an `Order` aggregate with the required parameters. Some parameters can be grouped with a tuple like
`oderItemTriplets` which represents a list `OrderItem` entities belonging to the `Order` aggregate (See
[here](#!/business-doc/concepts/oop#tuples) for more information on tuple pattern).



### Factory implementation

A factory implementation should:
 
- extend provided `BaseFactory` abstract class (itself implementing `GenericFactory`).
- implement its previously designed interface.

```
package org.mycompany.myapp.domain.model.order;

import org.javatuples.Triplet;
import org.seedstack.business.api.domain.BaseFactory;
import org.mycompany.myapp.domain.customer.CustomerId;

public class OrderFactoryImpl extends BaseFactory<Order> implements OrderFactory {

    @Override
    public Order createOrder(String customerId, Date checkoutDate, double price, 
								List<Triplet<Integer, Double, Long>> orderItemTriplets) {
        Order o = new Order();
        o.setPrice(price);
        o.setCustomerId(new CustomerId(customerId));
        o.setCheckoutDate(checkoutDate);

        List<OrderItem> orderItems = new ArrayList<OrderItem>();
        for (Triplet<Integer, Double, Long> orderItemTriplet : orderItemTriplets) {
            OrderItem oi = new OrderItem();
            oi.setQuantity(orderItemTriplet.getValue0());
            oi.setPrice(orderItemTriplet.getValue1());
            oi.setProductId(orderItemTriplet.getValue2());
            orderItems.add(oi);
        }
        o.setItems(orderItems);

        return o;
    }
}
```

With Order and OrderItem entities having a package visibility constructor, the use of new Order() and  new OrderItem() 
is possible only because the entities share the same package as their aggregate factory.

{{% callout info %}}
When the implementation and its interface share the same package, the **implementation should be in package-visibility**. 
It prevents any direct use of the implementation.
{{% /callout %}}

