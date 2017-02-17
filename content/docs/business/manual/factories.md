---
title: "Factories"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - "factory"
    - "pattern"
    - "aggregate"
    - "lifecycle"
    - "persistence"
menu:
    BusinessManual:
        weight: 50
---

A factory is a pattern used to **create domain objects**, checking that provided data is complete and consistent.<!--more-->

To be created by a factory the domain object must also implements `Producible`. This is necessary because all
the domain objects are not producible by a factory. For instance an entity is only be producible by an aggregate
root.

The types implementing `DomainObject` and `Producible` are the followings:

* AggregateRoot,
* DomainPolicy,
* ValueObject,
* DomainEvent,
* DomainService.

# Default factory

The default factory has a single method `create` with varargs that will match via reflection the constructor corresponding
to the passed arguments. The created domain object should implement the desired constructors:

```java
public class Customer extends BaseAggregate<Long> {
    private Long id;

    Customer(String firstName, String lastName) {
        // ...
    }
}
```

The default factory can then be injected and used by invoking its `create()` method with arguments unambiguously corresponding
to only one constructor:

```java
public class SomeClass {
    @Inject
    private Factory<Customer> factory;
    
    public void someMethod() {
        Customer customer = factory.create("John", "Doe");
    }
}
```

One benefit over the plain constructor approach is that default factories will invoke identity generation 
(see [below](#identity-generation)) and/or validation automatically after object instantiation.

{{% callout info %}}
This factory can only be used to create domain objects that implement the `Producible` and `DomainObject` interfaces. Classes
extending Business framework base classes will already implement those interfaces but annotated POJO, such as policies or
services, must implement them explicitly. As an alternative, you implement the `GenericDomainPolicy` and `GenericDomainService`
interfaces instead.
{{% /callout %}}

# Custom factory

A custom factory is composed of an interface, which is located in the package of the aggregate it constructs, and an
implementation which can be located either:

* In the aggregate package too,
* Or in an infrastructure package if it is dependent upon a specific technology.

The factory interface has to extend the `GenericFactory` interface:

```
package org.mycompany.myapp.domain.model.order;

import org.javatuples.Triplet;
import org.seedstack.business.domain.GenericFactory;

public interface OrderFactory extends GenericFactory<Order> {

    Order createOrder(String customerId, Date checkoutDate, Double price,
            List<Triplet<Integer, Double, Long>> orderItemTriplets);
}
```

* `Order` is the type which is the expected to be returned by all the create methods.
* `createOrder` method creates an `Order` aggregate with the required parameters. Some parameters can be grouped with a tuple like
`oderItemTriplets` which represents a list `OrderItem` entities belonging to the `Order` aggregate (see
[tuples]({{< ref "docs/business/manual/index.md#tuples" >}}) for more information on tuple pattern).

The factory implementation must extend the `BaseFactory` abstract class and implement its own interface.

```java
package org.mycompany.myapp.domain.model.order;

import org.javatuples.Triplet;
import org.seedstack.business.domain.BaseFactory;
import org.mycompany.myapp.domain.customer.CustomerId;

public class OrderFactoryImpl extends BaseFactory<Order> implements OrderFactory {
    @Override
    public Order createOrder(String customerId) {
        Order o = new Order();

        o.setCustomerId(new CustomerId(customerId));
        o.setCheckoutDate(new Date());

        return o;
    }
}
```

Here, the factory encapsulates the logic of creating a minimal but valid `Order` aggregate. This order can be further
populated by an assembler or by custom logic.

{{% callout info %}}
When the implementation and its interface share the same package, the **implementation should be in package visibility**.
It prevents any direct use of the implementation.
{{% /callout %}}

# Identity generation

Factories provide methods to create entities with a well defined identity. But sometimes, you want to delegate the identity
creation, for instance to an Oracle sequence. For this use case Seed provides an **identity generation strategies**.
A generation strategy makes sure a unique identity is provided to any new Entity before it is even persisted.

## Declaration

Below is an aggregate using the identity strategy:

```java
package org.mycompany.myapp.domain.model.myaggregate;

public class MyAggregate extends BaseAggregateRoot<UUID> {
    @Identity(handler = UUIDHandler.class)
    private UUID id;

    private String name;
    private MyEntity mySubEntity;
    private Set<MyEntity> mySubEntities;
}
```

Below is an Entity using the identity strategy:

```java
package org.mycompany.myapp.domain.model.myaggregate;

public class MyEntity extends BaseEntity<Long> {
    @Identity(handler = SequenceHandler.class)
    private Long id;
}
```

The `@Identity` annotation is applied on attribute holding the object identity. This annotation takes two arguments:

* `handler`: strategy implementation
* `source`: a String that can be used in a custom handler. For instance, it could provide a SEQUENCE name for DB.

Only specifying the identity strategy is not enough to effectively generate an identity. An implementation of the strategy
must be configured using [class configuration]({{< ref "docs/seed/configuration.md#class-configuration" >}}):

```yaml
classes:
  org:
    mycompany:
      myapp:
        domain:
          model:
            myaggregate:
              MyAggregate:
                identityHandler: simpleUUID
              MyEntity:
                identityHandler: oracleSequence
                identitySequenceName: MY_SEQUENCE
```

In this case we can see that the `simpleUUID` implementation will be used for `MyAggregate`. Similarly, the `oracleSequence`
implementation will be used for `MyEntity`. Note that this latter handler is further configured with the database 
sequence name.

## Usage

The chosen identity strategy is applied:

* Automatically, on methods annotated with the `@Create` annotation. They are intercepted to apply the identity strategy
on their return value.

```java
public class MyAggregateFactoryDefault extends BaseFactory<MyAggregate>
        implements MyAggregateFactory {

    @Create
    @Override
    public MyAggregate createMyAggregate(String name) {
        MyAggregate myAggregate = new MyAggregate();
        myAggregate.setName(name);

        MyEntity myEntity = createMyEntity();
        myAggregate.setMyEntity(myEntity);

        return myAggregate;
    }

    @Create
    MyEntity createMyEntity() {
        return new MyEntity();
    }
}
```

* Manually, by injecting the `IdentityService` service and invoking its `identify()` method with the entity to generate
an identity for as argument.

```java
public class MyAggregateFactoryDefault extends BaseFactory<MyAggregate>
        implements MyAggregateFactory {

    @Inject
    private IdentityService identityService;

    @Override
    public MyAggregate createMyAggregate(String name) {
        MyAggregate myAggregate = new MyAggregate();
        identityService.identify(myAggregate);
        myAggregate.setName(name);

        MyEntity myEntity = new MyEntity();
        identityService.identify(myEntity);
        myAggregate.setMyEntity(myEntity);

        return myAggregate;
    }
}
```

Note that identity generation doesn't walk the object graph to generate identities for eventual sub-entities. You must
trigger identity generation (automatically or manually) separately on each entity.

{{% callout tips %}}
If all methods of a factory delegate identity generation to Seed, a `@Create` annotation can be applied directly at the
class or interface level.
{{% /callout %}}


## Custom identity handler

![identity-seed](img/manage-entity-spi.svg)

Two different options are available to define custom identity handlers:

![identity-seed](img/manage-entity-usage.png)

Below is an example of a basic Timestamp id generation strategy:

```java
package org.mycompany.myapp.infrastructure.domain;

import org.seedstack.business.domain.BaseEntity;
import org.seedstack.business.domain.identity.IdentityHandler;

@Named("timestamp-id")
public class TimestampIdentityHandler implements IdentityHandler<BaseEntity<Long>, Long> {

    @Override
    public Long handle(BaseEntity<Long> entity, Map<String, String> entityConfig) {
        return new Date().getTime();
    }
}
```

## Built-in identity strategies

### Sequence

The sequence strategy provides a unique ever-incrementing number. Note that there is no requirement for numbers to be
contiguous. Implementations of this strategy must implement the {{< java "org.seedstack.business.domain.identity.SequenceHandler" >}}
interface. 

#### In-memory implementation

This implementation should only be used for testing (no state is preserved across restarts). It is
implemented by {{< java "org.seedstack.business.test.identity.InMemorySequenceHandler" >}}. It is configured as follows:

```yaml
classes:
  org:
    mycompany:
      myapp:
        domain:
          model:
            myaggregate:
              MyAggregate:
                identityHandler: inMemorySequence
```

#### Oracle sequence handler

This implementation will delegate the identity generation to an Oracle database. It is implemented by 
{{< java "org.seedstack.jpa.internal.OracleSequenceHandler" >}} in the [JPA add-on]({{< ref "addons/jpa/index.md" >}}). 
It is configured as follows:

```yaml
classes:
  org:
    mycompany:
      myapp:
        domain:
          model:
            myaggregate:
              MyAggregate:
                identityHandler: oracleSequence
                sequenceName: MY_SEQUENCE
```

Note that this implementations needs the database sequence name in the `sequenceName` configuration attribute.

### UUID

The UUID strategy provides an [Universally Unique Identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier).
Implementations of this strategy must implement the {{< java "org.seedstack.business.domain.identity.UUIDHandler" >}}
interface. 

#### Simple UUID

This implementation uses `randomUUID()` method from the {{< java "java.util.UUID" >}} Java class. It is configured as follows: 

```yaml
classes:
  org:
    mycompany:
      myapp:
        domain:
          model:
            myaggregate:
              MyAggregate:
                identityHandler: simpleUUID
```
