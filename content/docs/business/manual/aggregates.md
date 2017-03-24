---
title: "Aggregates"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - "aggregate"
    - "pattern"
    - "lifecycle"
    - "domain"    
menu:
    BusinessManual:
        weight: 22
---

{{% callout def %}}
**An aggregate is a cluster of cohesive entities and value objects that is treated as a single unit.<br>
Aggregates have clear boundaries and are loosely coupled to each other.**
{{% /callout %}}

# Characteristics

## Aggregate root

An aggregate have one its entities acting as the aggregate root. **Any reference from outside the aggregate must only 
point to the aggregate root.** As such the aggregate root can ensure the integrity of the whole aggregate. 

The root can still hand references to internal entities but they must only be used transiently. Aggregate value object 
references can be handed without any concern because they are immutable and side-effect free. 

## Identity

The identity of the aggregate is the identity of its root entity which must be globally unique in the system.
Non-root entities inside the aggregate can have a local identity that is required to be unique only within the aggregate.

## Invariants

**Any change within the aggregate must satisfy all the aggregate invariants.** The aggregate root is responsible for
enforcing invariants. This can also be delegated to technical infrastructure (like bean validation).

## Persistence

**Only a whole aggregate can be loaded directly from persistence.** All other objects must be found by traversal of inner 
aggregate associations. [Repositories]({{< ref "docs/business/manual/repositories.md" >}}) are responsible for managing
aggregate persistence.

## Consistency

Within an aggregate, consistency rules must be applied synchronously. Between aggregates, consistency must be applied
asynchronously. 

This means that if the system is transaction-based, **a transaction should never cross aggregate boundaries.**

# Declaration

## Boundary (package)

An aggregate boundary is materialized by a Java package named after the aggregate:

```plain
[base.package].domain.model.aggregate1
```

If your domain is subdivided in multiple sub-domains the convention becomes:

```plain
[base.package].domain.subdomain1.model.aggregate1
```

All entities and value objects belonging to the aggregate must be found inside this package. 

{{% callout ref %}}
More information can be found in the [package layout documentation]({{< ref "docs/business/architecture/index.md#package-layout" >}}).
{{% /callout %}}

## Aggregate root

To declare a chosen entity as the aggregate root, you have two alternatives.

{{% tabs list="Basic|Interface" %}}
{{% tab "Basic" true %}}
Instead of {{< java "org.seedstack.business.domain.BaseEntity" >}}, extend the {{< java "org.seedstack.business.domain.BaseAggregateRoot" >}} class:

```java
public class SomeAggregateRoot extends BaseAggregateRoot<SomeEntityId> {
    private SomeEntityId id;

    public SomeAggregateRoot(SomeEntityId id) {
        this.id = id;
    }

    @Override
    public SomeEntityId getEntityId() {
        return this.id;
    }
    
    // Other methods
}
```

{{< java "org.seedstack.business.domain.BaseAggregateRoot" >}} is simply a specialization of {{< java "org.seedstack.business.domain.BaseEntity" >}} 
so you will inherit a default implementation of the `equals()` and `hashCode()` methods, consistent with the definition of an entity. 
The `toString()` method is also inherited.
{{% /tab %}}
{{% tab "Interface" %}}
Instead of {{< java "org.seedstack.business.domain.Entity" >}}, implement the {{< java "org.seedstack.business.domain.AggregateRoot" >}} interface:

```java
public class SomeAggregateRoot implements AggregateRoot<SomeEntityId> {
    private SomeEntityId id;

    public SomeAggregateRoot(SomeEntityId id) {
        this.id = id;
    }
    
    public int hashCode() {
        // TODO: implement using identity attribute only
    }

    public boolean equals() {
        // TODO: implement using identity attribute only
    }

    @Override
    public SomeEntityId getEntityId() {
        return this.id;
    }
    
    // Other methods
}
```

{{< java "org.seedstack.business.domain.AggregateRoot" >}} is simply a specialization of {{< java "org.seedstack.business.domain.Entity" >}}.
While allowing you to fully control the inheritance of your aggregate root, you will have to implement `equals()` and `hashCode()` methods yourself, 
consistently with the definition of an entity (i.e. based on the identity only). 
{{% /tab %}}
{{% /tabs %}}

# Defining aggregate boundaries

Most business domains have very interconnected entities, sometimes up to the point where there is always a path going from
any Entity to any other. We can try to minimize the number of associations in our design, and this is a good practice
but it can lead to a translation loss between business and software. In a typical object model, it is difficult to clearly
see the boundaries of a change. This is particularly acute in systems with concurrent access such as Web applications.

It is also difficult to guarantee the consistency of changes to objects in a model with complex associations and no clear
boundaries between objects. Considering every object as independent from each other is not a valid approach, but on the
other side, refreshing every object because of a change is not practical. **A balanced solution must be found**.

![Aggregate typologies](../img/aggregate-typologies.png)

We want to be as close as possible to the center pattern in the figure above. The aggregate is a cluster of associated 
objects that are considered as a unit for the purpose of data changes. 

# Example

Notice:

* How it maintains aggregate invariants like the `totalPrice` attribute according to the list of order items.
* How it prevents breaking domain rules by:
  * Encapsulating logic in well-defined operations (no setter !)
  * Protecting its internal state by returning values or immutable references. 
* How it is linked to other aggregates through their identifier (here `CustomerId`) instead of a strong reference.

```java
public class Order extends BaseAggregateRoot<OrderId> {
    private final OrderId id;
    private final CustomerId customerId;
    private final List<OrderItem> orderItems;
    private OrderState state;
    private Address shippingAddress;
    private Date orderDate;
    private double totalPrice = 0d;
    private double shippingCost = 0d;
    private double taxesCost = 0d;
    private PaymentStatus paymentStatus = PaymentStatus.NOT_PAID;

    public Order(OrderId id, CustomerId customerId) {
        this.id = id;
        this.customerId = customerId;
        this.orderItems = new ArrayList<>();
        this.state = OrderState.BASKET;
    }

    public void addItem(OrderItem orderItem) {
        if (state == OrderState.BASKET) {
            orderItems.add(orderItem);
            totalPrice += orderItem.price();
        } else {
            throw new OrderException("Item cannot be added to a completed order");
        }
    }

    public void removeItem(OrderItem orderItem) {
        if (state == OrderState.BASKET) {
            orderItems.remove(orderItem);
            totalPrice -= orderItem.price();
        } else {
            throw new OrderException("Item cannot be removed from a completed order");
        }
    }
    
    public void checkout() {
        if (state == Order.BASKET) {
            orderDate = new Date();
            state = OrderState.CHECKOUT;
        } else {
            throw new OrderException("Checkout is only possible on a basket");
        }
    }
    
    public void updateShippingAddress(Address newAddress, 
                                      ShippingPolicy shippingPolicy, 
                                      TaxesPolicy taxesPolicy) {
        if (state == OrderState.CHECKOUT || state == OrderState.PENDING) {
            shippingCost = shippingPolicy.calculateShippingCost(newAddress, totalPrice);
            taxesCost = taxesPolicy.calculateTaxesCost(totalPrice);
            shippingAddress = newAddress;
            state = OrderState.PENDING;
        } else {
            throw new OrderException("Order shipping address cannot be modified");
        }
    }
    
    public void updatePaymentStatus(PaymentStatus paymentStatus) {
        if (state == Order.PENDING) {
            this.paymentStatus = paymentStatus;
            state = OrderState.COMPLETED;
        } else {
            throw new OrderException("Payment status cannot be updated");
        } 
    }
    
    public List<OrderItem> items() {
        return Collections.unmodifiableList(orderItems);
    }    
    
    public double totalPrice() {
        return totalPrice;
    }

    public Optional<Address> shippingAddress() {
        return Optional.ofNullable(shippingAddress);
    }
    
    public double paymentAmount() {
        if (state == OrderState.PENDING) {
            return totalPrice + shippingCost + taxesCost;
        } else {
            throw new OrderException("Cannot calculate payment amount");
        }
    }

    @Override
    public OrderId getEntityId() {
        return id;
    }
}
```


