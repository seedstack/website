---
title: "Aggregate"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessAggregate"
menu:
    BusinessAggregate:
        weight: 10
---

Aggregates are clusters of domain objects that can be treated as a single unit.

{{% callout info %}}
This page describes how to implement **Aggregate** with the Business framework. To know more about the Aggregate
concept, refer to [this section](../../concepts/domain-model/#aggregate).
{{% /callout %}}

# Usage 

Creating an Aggregate with the Business Framework, consists in:

* Creating a package with the Aggregate name,
* Create all the domain objects belonging to the Aggregate in this package,
* From all those domain objects, one Entity should be created as the **Aggregate root**. This step is the focus of this
page.

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
