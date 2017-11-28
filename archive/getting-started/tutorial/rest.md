---
title: "Step 4 - The REST API"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedTutorial"
tags:
    - onboarding
    - REST
menu:
    GettingStartedTutorial:
        weight: 50
---

For our domain and its client application to be useful to others, we need to create an interface with the outside world.
In this example, we choose to build a simply REST API.<!--more--> 

SeedStack provides full JAX-RS 2 support through Jersey 2. We start by adding a simplified REST representation of an order 
to the `org.myorg.myapp.rest.order` package:

```java
@DtoOf(Order.class)
public class OrderRepresentation {
    private Long orderId;
    private Long customerId;
    private Date checkoutDate;
    private double total;

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Date getCheckoutDate() {
        return checkoutDate;
    }

    public void setCheckoutDate(Date checkoutDate) {
        this.checkoutDate = checkoutDate;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
```

The `@DtoOf` annotation indicates the business framework that `OrderRepresentation` is a DTO of the `Order` aggregate. This
will be required by the DTO assembling facade we will use below.

The default repositories don't provide methods to load and manipulate collections. We will write a `Finder` which will
be responsible for efficient retrieval of data specific to our REST interface (i.e. `OrderRepresentation`):

```java
@Finder
public interface OrderFinder {
    List<OrderRepresentation> findAllOrders();

    List<OrderRepresentation> findCustomerOrders(long customerId);
}
```

As it is dependent on Morphia, its implementation will go in the `org.myorg.myapp.infrastructure.morphia`
package:

```java
public class MorphiaOrderFinder implements OrderFinder {
    @Inject
    @MorphiaDatastore(clientName = "main", dbName = "ddd")
    private Datastore datastore;
    @Inject
    private FluentAssembler fluentAssembler;

    @Override
    public List<OrderRepresentation> findAllOrders() {
        Query<Order> query = datastore.find(Order.class);
        query.field("checkoutDate").notEqual(null);
        return fluentAssembler
                .assemble(query.asList())
                .with(ModelMapper.class)
                .to(OrderRepresentation.class);
    }

    @Override
    public List<OrderRepresentation> findCustomerOrders(long customerId) {
        Query<Order> query = datastore.find(Order.class);
        query.field("checkoutDate").notEqual(null);
        query.field("customerId").equal(customerId);
        return fluentAssembler
                .assemble(query.asList())
                .with(ModelMapper.class)
                .to(OrderRepresentation.class);
    }
}
```

Finally, we write the JAX-RS resource, making use of both the `OrderFinder` and the default repository of `Order` aggregate:

```java
@Path("/orders")
public class OrderResource {
    @Inject
    private OrderFinder orderFinder;
    @Inject
    private Repository<Order, Long> orderRepository;
    @Inject
    private FluentAssembler fluentAssembler;

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public List<OrderRepresentation> listOrders(@QueryParam("customerId") Long customerId) {
        if (customerId == null) {
            return orderFinder.findAllOrders();
        } else {
            return orderFinder.findCustomerOrders(customerId);
        }
    }

    @GET
    @Path("/{orderId}")
    @Produces({MediaType.APPLICATION_JSON})
    public OrderRepresentation getOrderDetails(@PathParam("orderId") Long orderId) {
        Order order = orderRepository.load(orderId);
        if (order == null) {
            throw new NotFoundException("Order " + orderId + " not found");
        }
        return fluentAssembler.assemble(order).with(ModelMapper.class).to(OrderRepresentation.class);
    }
}
```

You can now request the mock orders we created earlier with one of the following REST endpoints:

* `/orders` which is the list of all orders. This URL accepts a `customerId` query param to only return the orders of a specific
customer.
* `/orders/{orderId}` which is the detail of a specific order (like `/orders/1`). For simplicity, we just return the same
representation as in the list but we can build another, more detailed, representation of an `Order` for this sub-resource.
