---
title: "Step 1 - The domain"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedTutorial"
tags:
    - onboarding
    - domain-driven design
menu:
    GettingStartedTutorial:
        weight: 20
---

Now it is time to write the domain of the application. To do so, we will use the [business framework]({{< ref "docs/business/index.md" >}}) which
is implementing Domain-Driven Design principles and patterns.<!--more-->

# The domain model

The domain model goes in the `org.myorg.myapp.domain.model` package with a subpackage for each aggregate.

![UML diagram of the domain model](./model.png)

## The Order aggregate

The order aggregate represents a commercial order of products, in the subpackage `order`. It is composed of the `OrderItem`
value object:

```java
public class OrderItem extends BaseValueObject {
    private long productId;
    private int quantity;
    private double unitaryPrice;

    public OrderItem(long productId, int quantity, double unitaryPrice) {
        this.productId = productId;
        this.quantity = quantity;
        this.unitaryPrice = unitaryPrice;
    }

    public int getQuantity() {
        return quantity;
    }

    public long getProductId() {
        return productId;
    }

    public double getUnitaryPrice() {
        return unitaryPrice;
    }
}
```

And the `Order` entity which acts as the aggregate root, ensuring integrity of the whole aggregate:

```java
public class Order extends BaseAggregateRoot<Long> {
    private Long orderId;
    private Long customerId;
    private Date checkoutDate;
    private Map<Long, OrderItem> items = new HashMap<>();
    private double total = 0d;

    public Order(Long orderId, Long customerId) {
        this.orderId = orderId;
        this.customerId = customerId;
    }

    @Override
    public Long getId() {
        return orderId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public Date getCheckoutDate() {
        return checkoutDate;
    }

    public void checkout() {
        checkoutDate = new Date();
    }

    public boolean isCompleted() {
        return checkoutDate != null;
    }

    public void addItem(OrderItem orderItem) {
        if (isCompleted()) {
            throw new IllegalStateException("Cannot add items to a completed order");
        }

        long productId = orderItem.getProductId();
        if (items.containsKey(productId)) {
            throw new IllegalStateException("An order item for product " + productId + " already exists");
        }

        items.put(productId, orderItem);
        total += orderItem.getQuantity() * orderItem.getUnitaryPrice();
    }

    public OrderItem removeItem(OrderItem orderItem) {
        if (isCompleted()) {
            throw new IllegalStateException("Cannot remove items from a completed order");
        }

        OrderItem removedItem = items.remove(orderItem.getProductId());
        if (removedItem == null) {
            throw new IllegalStateException("Item for product " + orderItem.getProductId() + "doesn't exists");
        }

        total -= orderItem.getQuantity() * orderItem.getUnitaryPrice();
        return orderItem;
    }

    public Collection<OrderItem> getItems() {
        return Collections.unmodifiableCollection(items.values());
    }

    public double getTotal() {
        return total;
    }
}
```

## The Product aggregate

The product aggregate represents a commercial product that can be sold, in the `product` subpackage. It is solely composed
of the `Product` entity, acting as the aggregate root:

```java
public class Product extends BaseAggregateRoot<Long> {
    private Long productId;
    private String description;
    private double price;

    public Product(long productId, String description, double price) {
        this.productId = productId;
        this.description = description;
        this.price = price;
    }

    @Override
    public Long getId() {
        return productId;
    }

    public Long getProductId() {
        return productId;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }
}
```

## The Seller aggregate

The seller aggregate will represent someone that has the ability to sell products through placing orders, in the `seller`
subpackage. As we have multiple strategies to compute seller bonuses, we will create a policy:

```java
@DomainPolicy
public interface BonusPolicy {
    String PER_ITEM = "item";
    String TOTAL_PERCENTAGE = "percentage";

    double computeBonus(Order order);
}
```

The policy interface is annotated with `@DomainPolicy` to be recognized by the business framework. The first implementation
is a bonus which is a function of the number of items sold:

```java
@Named(BonusPolicy.PER_ITEM)
class ItemBonusPolicy implements BonusPolicy {
    private static final int ITEM_BONUS = 10;

    @Override
    public double computeBonus(Order order) {
        return order.getItems().stream().mapToInt(OrderItem::getQuantity).sum() * ITEM_BONUS;
    }
}
```

The `@Named` annotation is qualifying the implementation with a particular name. The second implementation is a bonus
which is a function of the total price of the order:

```java
@Named(BonusPolicy.TOTAL_PERCENTAGE)
class TotalBonusPolicy implements BonusPolicy {
    private static final double BONUS_RATE = 0.02;

    @Override
    public double computeBonus(Order order) {
        return order.getTotal() * BONUS_RATE;
    }
}
```

Again the `@Named` annotation is qualifying the implementation. Finally the Seller entity, will act as the aggregate
root:

```java
public class Seller extends BaseAggregateRoot<Long> {
    public static final int SENIORITY_THRESHOLD = 90;
    public static final long MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

    private Long sellerId;
    private Date hireDate;
    private String bonusPolicy = BonusPolicy.PER_ITEM;
    private double monthlyBonus = 0;

    public Seller(long sellerId, Date hireDate) {
        this.sellerId = sellerId;
        this.hireDate = hireDate;
    }

    @Override
    public Long getId() {
        return sellerId;
    }

    public void enablePercentageBonusPolicy() {
        if (new Date().getTime() - hireDate.getTime() < SENIORITY_THRESHOLD * MILLISECONDS_IN_A_DAY) {
            throw new IllegalStateException("Percentage bonus policy requires at least 3 years of seniority");
        }
        bonusPolicy = BonusPolicy.TOTAL_PERCENTAGE;
    }

    public void revertBonusPolicy() {
        bonusPolicy = BonusPolicy.PER_ITEM;
    }

    public String getBonusPolicy() {
        return bonusPolicy;
    }

    public void addToMonthlyBonus(double newBonus) {
        this.monthlyBonus += newBonus;
    }

    public void resetMonthlyBonus() {
        this.monthlyBonus = 0;
    }

    public Date getHireDate() {
        return hireDate;
    }

    public double getMonthlyBonus() {
        return monthlyBonus;
    }
}
```

The Seller aggregate will manage which bonus policy can be applied based on the seniority of the seller.

# Domain services

Domain services go in the `org.myorg.myapp.domain.services` package. Adding products to an order is not
a complex task in itself but some business logic is still necessary. As the logic involves two aggregates, it would be
cumbersome to place it in one of them. It is better located in a separate domain service:

```java
@Service
public interface OrderingService {
    void addProductToOrder(Order order, Product product, int quantity);
}
```

The service interface is annotated with `@Service` to be recognized by the business framework. As it is a pure domain
service, its implementation can be placed along in the same package:

```java
class OrderingServiceImpl implements OrderingService {
    @Override
    public void addProductToOrder(Order order, Product product, int quantity) {
        // Find items with the same product identifier if any
        List<OrderItem> itemsToRemove = order.getItems().stream()
                .filter(orderItem -> orderItem.getProductId() == product.getProductId())
                .collect(Collectors.toList());

        // Remove the items from the order and update the quantity
        quantity += itemsToRemove.stream().map(order::removeItem).mapToInt(OrderItem::getQuantity).sum();

        // Add a new item with the total quantity
        order.addItem(new OrderItem(
                product.getProductId(),
                quantity,
                product.getPrice() * quantity)
        );
    }
}
```

We will also add a `BonusService` to compute the bonus of a `Seller` for a specific `Order`:

```java
@Service
public interface BonusService {
    void updateSellerBonus(Seller seller, Order order);
}
```

With the following implementation:

```java
class BonusServiceImpl implements BonusService {
    private final DomainRegistry domainRegistry;

    @Inject
    public BonusServiceImpl(DomainRegistry domainRegistry) {
        this.domainRegistry = domainRegistry;
    }

    public void updateSellerBonus(Seller seller, Order order) {
        BonusPolicy bonusPolicy = domainRegistry.getPolicy(BonusPolicy.class, seller.getBonusPolicy());
        double orderBonus = bonusPolicy.computeBonus(order);
        seller.addToMonthlyBonus(orderBonus);
    }
}
```

Note that this service injects and uses the business framework `DomainRegistry` which can be used to retrieve domain
elements dynamically, such as the policy in this case (which depends upon the seller instance).
