---
title: "Factories"
type: "home"
zones:
    - "Docs"
tags:
    - domain-driven design
aliases: /docs/business/manual/factories    
menu:
    docs:
        parent: "business"
        weight: 20
---

{{% callout def %}}
**A factory is responsible for creating a whole, internally consistent aggregate when it is too complicated to do
it in a constructor.**
{{% /callout %}}
<!--more-->

## Characteristics

### Objects produced

A factory is part of the domain and responsible for creating some domain objects. In the business framework a factory
can only create domain objects implementing {{< java "org.seedstack.business.Producible" >}}:

* Aggregates,
* Value objects,
* Domain events.

Note that non-root entities are not produced by factories but should be created by their aggregate root.

### Identity creation

Being responsible for creating valid aggregates, factories may need to create their identity. This can be done from 
input parameters given to the factory or by using a generation mechanism. This mechanism can be automated by the business
framework, see [below]({{< ref "docs/business/factories.md#identity-generation" >}}). 

## Default factory

The business framework provides a default factory for each class implementing {{< java "org.seedstack.business.Producible" >}}
that does not already has a [custom factory](#custom-factory). To use a default factory, [inject]({{< ref "docs/basics/dependency-injection.md" >}})
the {{< java "org.seedstack.business.domain.Factory" >}} interface, with the type to create as generic parameter: 

```java
public class SomeClass {
    @Inject
    private Factory<SomeAggregate> someAggregateFactory;
    
    public void someMethod() {
        SomeAggregate someAggregate = factory.create(new Name("John Doe"));
    }
}
```

The `create(...)` method can take any argument(s), and will:

1. Try to find a constructor on the produced class that unambiguously matches the given argument types,
2. Invoke this constructor if found or throw an exception if not,
3. Use the {{< java "org.seedstack.business.domain.IdentityService" >}} to generate an identity on the produced object if
necessary.

## Custom factory

If you need custom creation logic, it is necessary to define a custom factory.

### Declaration

To declare a factory, create an interface extending {{< java "org.seedstack.business.domain.Factory" >}}, in the aggregate 
package, with at least one method for creating the produced object: 
  
```java
public interface SomeFactory extends Factory<SomeAggregate> {
    SomeAggregate createFromName(String name);
}
```
  
Then implement this interface in a class extending {{< java "org.seedstack.business.domain.BaseFactory" >}}:
  
```java
public class SomeFactoryImpl extends BaseFactory<SomeAggregate> implements SomeFactory {
    SomeAggregate createFromName(String name) {
        SomeAggregate someAggregate = new SomeAggregate(new Name(name));
        someAggregate.initialize(new Date());
        return someAggregate;
    }
}
``` 

If the implementation does not depend upon technical aspects like a library, put it in the same package as the interface, 
otherwise move the implementation in the infrastructure package.

### Usage

To use your custom factory, [inject]({{< ref "docs/basics/dependency-injection.md" >}}) the custom interface: 

```java
public class SomeClass {
    @Inject
    private SomeFactory someFactory;
    
    public void someMethod() {
        SomeAggregate someAggregate = someFactory.createFromName("someName");
        // do something with aggregate
    }
}
```
  
## Identity generation

### Declaration 

The business framework provides an identity generation mechanism. To use it, annotate the field of the aggregate root 
holding the identity with {{< java "org.seedstack.business.domain.Identity" "@" >}} and an optional qualifier to
select the correct implementation:

```java
public class SomeAggregate extends BaseAggregateRoot<UUID> {
    @Identity(generator = SequenceGenerator.class)
    @InMemory
    private Long id;
}
```

### Usage

To automatically trigger the identity generation mechanism at the end of a creation method, annotate it with the 
{{< java "org.seedstack.business.domain.Create" "@" >}} annotation:

```java
public class SomeFactoryImpl extends BaseFactory<SomeAggregate> implements SomeFactory {
    @Create
    SomeAggregate createFromName(String name) {
        SomeAggregate someAggregate = new SomeAggregate(new Name(name));
        someAggregate.initialize(new Date());
        return someAggregate;
    }
}
```  

As an alternative you can inject the generated identity programmatically by using the {{< java "org.seedstack.business.domain.IdentityService" >}}:

```java
public class SomeClass {
    @Inject
    private IdentityService identityService;

    public void someMethod() {
        SomeAggregate someAggregate = new SomeAggregate(new Name(name));
        identityService.identify(someAggregate);
        return someAggregate;
    }
}
```

{{% callout warning %}}
Note that identity generation does not walk the object graph to generate identities for potential sub-entities. You must
trigger identity generation (automatically or manually) separately on each entity.
{{% /callout %}}

### Class configuration

To avoid specifying the generator qualifier in code, you can specify it as the `defaultGenerator` key in 
[class configuration]({{< ref "docs/core/configuration.md#class-configuration" >}}):

```yaml
classes:
  org:
    mycompany:
      myapp:
        domain:
          model:
            someaggregate:
              defaultGenerator: org.seedstack.business.util.inmemory.InMemory
```

{{% callout info %}}
The `defaultGenerator` property expects either: 

* A qualifier annotation class name (like {{< java "org.seedstack.business.util.inmemory.InMemory" "@" >}}),
* Or an arbitrary string which will be used as the parameter of the {{< java "javax.inject.Named" "@" >}} qualifier.
{{% /callout %}}


### Built-in identity generators

#### Sequence

The sequence generator provides a unique ever-incrementing number. Numbers are not required to be contiguous. Implementations 
of this strategy must implement the {{< java "org.seedstack.business.domain.SequenceGenerator" >}} interface. 

An in-memory implementation is provided by {{< java "org.seedstack.business.util.inmemory.InMemorySequenceGenerator" >}}.
Its qualifier is {{< java "org.seedstack.business.util.inmemory.InMemory" "@" >}}.

Other implementations may be found in the [add-ons library]({{< baseUrl >}}addons). 

#### UUID

The UUID generator uses a [Universally Unique Identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) as
identity. Implementations of this generator must implement the {{< java "org.seedstack.business.domain.UuidGenerator" >}}
interface.
 
An implementation that uses the {{< java "java.util.UUID" >}} Java class is provided by {{< java "org.seedstack.business.domain.SimpleUuidGenerator" >}}.
Its qualifier is `@Named("simpleUUID")`.

### Custom identity generator

You can define your own custom generator. Either write :

* A direct implementation of {{< java "org.seedstack.business.domain.IdentityGenerator" >}},
* An implementation of an existing generator interface,
* Or an interface extending {{< java "org.seedstack.business.domain.IdentityGenerator" >}} and an implementation of this
custom interface.  

As an example of the second option, consider the code below:

```java
@Named("timestamp")
public class TimestampIdentityGenerator implements SequenceGenerator<Long> {
    @Override
    public <E extends Entity<Long>> Long generate(Class<E> entityClass) {
        return new Date().getTime();
    }
}
```

## Example

### The identity generator

```java
public class OrderIdGenerator implements IdentityGenerator<OrderId> {
    @Override
    public <E extends Entity<OrderId>> OrderId generate(Class<E> entityClass) {
        // custom logic to generate order identifiers
    }
}
```

### The aggregate

```java
public class Order extends BaseAggregateRoot<OrderId> {
    @Identity(generator = OrderIdGenerator.class)
    private final OrderId id;
    
    // ...
}
```


### The factory interface

```java
public interface OrderFactory extends GenericFactory<Order> {
    Order createOrder(Customer customer, List<Pair<ProductId, Integer>> orderedProducts);
    
    Order createRepeatOrder(Order previousOrder);
    
    Order createCreditOrder(Order orderToCredit);    
}
```

### The factory implementation

```java
@Create
public class OrderFactoryImpl extends BaseFactory<Order> implements OrderFactory {
    @Override
    public Order createOrder(CustomerId customerId) {
        return new Order(customerId);
    }
    
    @Override
    public Order createRepeatOrder(Order previousOrder) {
        Order order = new Order(previousOrder.getCustomerId());
        previousOrder.items().forEach(order::addItem);
        return order;
    }
    
    @Override
    public Order createCreditOrder(Order orderToCredit) {
        return new CreditOrder(orderToCredit.getCustomerId(), orderToCredit.getId());
    }
}
```  

