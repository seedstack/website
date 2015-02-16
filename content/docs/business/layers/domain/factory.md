---
title: "Factory"
zones:
    - "Business"
sections:
    - "BusinessDomainLayer"
menu:
    BusinessDomainLayer:
        weight: 40
---

A factory is used to **create domain objects**, checking provided data is complete and consistent.

<div class="callout callout-info">
To be created by a factory the domain object must also implements <code>Producible</code>. This is necessary because all
the domain objects are not producible by a factory. For instance an entity is only be producible by an aggregate
root.
</div>

The types implementing `DomainObject` and `Producible` are the followings:

* AggregateRoot, 
* DomainPolicy,
* ValueObject,
* DomainEvent,
* DomainService.
 
# Factory interface

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



# Factory implementation

A factory implementation should:
 
- extend provided `BaseFactory` abstract class (itself implementing `GenericFactory`).
- implement its previously designed interface.

```
package org.mycompany.myapp.domain.model.order;

import org.javatuples.Triplet;
import org.seedstack.business.core.domain.base.BaseFactory;
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

<div class="callout callout-info">
Since the implementation and its interface share the same package and only the interface is to be used and injected, 
the <strong>implementation should be in package-visibility</strong>. It is possible to prevent any direct use of the implementation 
by making it visible at a package level.
</div>

# Default factory

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

# Entity identity management

Factories provide methods to create entities with a well defined identity. But sometimes, you want to delegate the identity
creation, for instance to an Oracle sequence. For this use case SEED provides an **identity generation strategies**. 
A generation strategy makes sure a unique identity is provided to any new Entity before it is even persisted.

## Use identity strategy

SEED Identity feature requires both a strategy/behaviour and an implementation. The implementation can be either of the 
`IdentityHandler` super interface or an intermediate "Named" (according to behaviour) interface (See 
[SPI documentation](#!/business-doc/hands-on-domain/factory#custom-identity-handler)).

* In every case, the `IdentityHandler` interface should be used.
  
* The implementation is provided through [Entity configuration](#!/business-doc/hands-on-domain/entity#configuration-spi).
  Within Entity section, set  **identity.handler-qualifier** key value to the qualified name of the implementation 
  (`@Named` class annotation, e.g. "timestamp-id" in above code).

> The implementation can also be used, but it is not recommended if it's not part of the domain.

## Example

**Entity**

Below is an aggregate using SEED Identity feature: 

```
package org.mycompany.myapp.domain.model.myaggregate;

public class MyAggregate extends BaseAggregateRoot<UUID> {

	@Identity(handler = UUIDHandler.class)
	private UUID id;
	
	private String name;
	private MyEntity mySubEntity;
	private Set<MyEntity> mySubEntities;
}
```

```
package org.mycompany.myapp.domain.model.myaggregate;

public class MyEntity extends BaseEntity<UUID> {

	@Identity(handler = SequenceHandler.class)
	private UUID id;
}
```

`@Identity` annotation has to apply on the Entity identity attribute. This annotation takes tow arguments:

- `handler`: strategy implementation
- `source`: a String that can be used in a custom handler. For instance, it could provide a SEQUENCE name for DB.

**Configuration**
	
	[org.mycompany.myapp.domain.model.myaggregate.MyAggregate]
	identity.handler-qualifier = simple-UUID

	[org.mycompany.myapp.domain.model.myaggregate.MyEntity]
	identity.handler-qualifier = oracle-sequence
	identity.sequence-name = SEQ_TEST

**Factory**

Below is a Factory interface for above `MyAggregate` Class:

```
package org.mycompany.myapp.domain.model.myaggregate;

import org.seedstack.business.api.domain.GenericFactory;
import org.seedstack.business.api.domain.annotations.stereotypes.Create;

public interface MyAggregateFactory  extends GenericFactory<MyAggregate> {
	MyAggregate createMyAggregate(String name);
}
```

Below is a Factory implementation for above `MyAggregateFactory` interface:

```
package org.mycompany.myapp.domain.model.myaggregate;

import org.seedstack.business.api.domain.annotations.stereotypes.Create;
import org.seedstack.business.core.domain.base.BaseFactory;

public class MyAggregateFactoryDefault extends BaseFactory<MyAggregate>
		implements MyAggregateFactory {

	@Create
	@Override
	public MyAggregate createMyAggregate(String name) {
		
		MyAggregate myAggregate = new MyAggregate();
		myAggregate.setName(name);
		
		MyEntity mySubAggregate = createMySubEntity();
		myAggregate.setMySubAggregate(mySubAggregate);
		
		return myAggregate;
	}

	@Create
	MyEntity createMySubEntity() {
		return new MyEntity();
	}
}
```

**How it works:**

- Only annotated methods with `@Create` are intercepted for id generation (**Except if the method is private**)
- Id generations only applies to the generated Entity (not sub entities) - one "create method" is required for each 
Entity requiring id generation

<div class="callout callout-info"> 
If all factory methods delegate id generation to SEED, <code>@Create</code> annotation can apply at class or interface level.

Alternatively, you can inject <code>IdentityService</code> to programmatically and individually generate an identity on compliant 
Entities (id attribute annotated with <code>@Identity</code>) as in following test:
</div>

```
@RunWith(SeedITRunner.class)
public class IdentityServiceIT {
	@Inject
	IdentityService identityService;
	
	@Test
	public void identify_entity() {
		MyAggregate myAggregate = new MyAggregate();
		identityService.identify(myAggregate);
		Assertions.assertThat(myAggregate.getEntityId()).isNotNull();
	}
	
    ...
}
```

## Custom identity handler

![identity-seed](/img/business/manage-entity-spi.svg)

Two different options are available to define custom identity handlers:

![identity-seed](/img/business/manage-entity-usage.png)

**Example:**

Below is an example of a basic Timestamp id generation strategy:

```
package org.mycompany.myapp.infrastructure.domain;

import org.seedstack.business.api.domain.base.BaseEntity;
import org.seedstack.business.api.domain.identity.IdentityHandler;

@Named("timestamp-id")
public class TimestampIdentityHandler implements IdentityHandler<BaseEntity<Long>, Long>{
	@Override
	public Long handle(BaseEntity<Long> entity,
			Map<String, String> entityConfiguration) {
		return new Date().getTime();
	}

}
```

## Provided identity strategies

**SequenceHandler**

Handles sequence generated ID. Two implementations are provided:

* `OracleSequenceHandler`: Get next oracle sequence value for new entity id. The following properties.

```
[org.mycompany.myapp...YourEntity]
identity.handler-qualifier = oracle-sequence
identity.sequence-name = your_sequence_name
```

* `inMemorySequenceHandler`: To be used **ONLY** for testing (preserves behaviour without a database). The following 
properties.

```
[org.mycompany.myapp...YourEntity]
identity.handler-qualifier = inmemory-sequence
```

**UUIDHandler**

Use for handling UUID generated ID. One implementation is provided:

* `SimpleUUIDHandler`: Get new random UUID from java.util.UUID.randomUUID(). Need one property using entity props 
configuration:

```
[org.mycompany.myapp...YourEntity]
identity.handler-qualifier = simple-UUID 
```

For a full description of Entity properties configuration, refer to this 
[documentation](#!/business-doc/hands-on-domain/entity#configuration-spi).
