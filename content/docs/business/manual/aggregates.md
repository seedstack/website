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
        weight: 30
---

Domain objects have a lifecycle: they are created, go through various states and eventually die (either being archived
or deleted). Many of these objects are simple, transient objects which are simply created with a call to their constructor
and thrown away after use. There is no need to complicate such objects. But some objects are more rich, with a complex
lifecycle and numerous relationships with other objects. 

The challenges of managing these objects can also be addressed with several patterns. The first one is the **aggregate pattern,
which define clear ownership and boundaries between domain objects**.

# What is an aggregate ?

Most business domains have very interconnected entities, sometimes up to the point where there is always a path going from
any Entity to any other. We can try to minimize the number of associations in our design, and this is a good practice
but it can lead to a translation loss between business and software. In a typical object model, it is difficult to clearly
see the boundaries of a change. This is particularly acute in systems with concurrent access such as Web applications.

{{% callout info %}}
It is also difficult to guarantee the consistency of changes to objects in a model with complex associations and no clear
boundaries between objects. Considering every object as independent from each other is not a valid approach, but on the
other side, refreshing every object because of a change is not practical. **A balanced solution must be found**.
{{% /callout %}}

![Aggregate typologies](../img/aggregate-typologies.png)

With the **aggregate pattern**, we want to be as close as possible to the center pattern in the figure above. The aggregate
is a cluster of associated objects that are considered as a unit for the purpose of data changes. Each Aggregate has root 
and a boundary which determines what is inside the Aggregate. 

The Aggregate root is a specific Entity contained in the Aggregate. It is the only entry-point of the Aggregate, meaning 
that it is the only Aggregate Entity that client objects can hold references to. Other objects of the Aggregate are only 
accessible through the context of the Aggregate root.


# Characteristics

The following rules apply to Aggregates:

* The Aggregate root has a global identity and is responsible for checking invariants within the Aggregate.
* Non-root Entities inside the Aggregate have a local identity that is only unique within the Aggregate.
* Code outside the Aggregate can only hold references to the Aggregate root. The root can hand references to internal
entities but they must only use them transiently and not hold to the reference. Value Objects can be handed without
any concern because they are immutable and side-effect free.
* Only Aggregate roots can be loaded directly from the persistence. All other objects must be found by traversal of
associations.
* Any change within the Aggregate boundary must satisfy all the Aggregate invariants.

# Declaration

Creating an Aggregate with the Business Framework, consists in:

* Creating a package with the Aggregate name,
* Create all the domain objects belonging to the Aggregate in this package,
* From all those domain objects, one Entity should be created as the **Aggregate root**. This step is the focus of this
section.

To create an Aggregate root using the Business framework you have three choices:

* Extend the `BaseAggregateRoot` class. This class directly extends `BaseEntity` and as such the `equals()`, `hashCode()`
and `compareTo()` methods will be provided out-of-the-box.
* Implement the `AggregateRoot` interface. You must implement the `equals()`, `hashCode()` and `compareTo()` methods in
this case.
* Simply annotate any class with the `@DomainAggregateRoot` annotation. In this case, you won't be able to use helpers and
tools from the framework.

With the two first options (base class and interface), you have to provide a generic parameter with the type of the
Aggregate root identifier.

# Example

    public class Order extends BaseAggregateRoot<Long> {
        private Long orderId;
        private Date checkoutDate;
        private double price;
        private List<OrderItem> items;

        Order() {
        }

        @Override
        public Long getEntityId() {
            return orderId;
        }

        public void addOrderItem(int quantity, long productId, double price) {
            OrderItem orderItem = new OrderItem();
            orderItem.setQuantity(quantity);
            orderItem.setProductId(productId);
            orderItem.setPrice(price);
            items.add(orderItem);
        }

        public void clearOrderItems() {
            items.clear();
        }

        public Long getOrderId() {
            return orderId;
        }

        ...
    }


