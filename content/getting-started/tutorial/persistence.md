---
title: "Step 2 - The persistence"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedTutorial"
menu:
    GettingStartedTutorial:
        weight: 30
---

We are going to add MongoDB persistence to our domain model by using the [SeedStack MongoDB add-on](http://seedstack.org/addons/mongodb)
with the Morphia object-document mapping.<!--more--> Add the following Maven dependency to the `pom.xml` file:

{{< dependency g="org.seedstack.addons.mongodb" a="mongodb-morphia" >}}

The version of the dependency is managed by the SeedStack BOM. 

{{% callout tips %}}
One way of installing MongoDB locally is to use [Docker](https://www.docker.com/). Install it for your operating system,
and then run the official [MongoDB docker image](https://hub.docker.com/_/mongo/) on your instance:

```plain
docker run --name some-mongo -p 27017:27017 -d mongo
```
{{% /callout %}}

We need to configure a MongoDB client in the `seed.props` file, located in `META-INF/configuration`:

```yaml
mongoDb:
  clients:
    main:
      hosts: localhost
      databases: ddd
```

A little bit of configuration is also required to link our domain model to the MongoDB client and database we just declared:

```yaml
classes:
  org:
    myorg:
      myapp:
        domain:
          model:
            mongoDbClient: main
            mongoDbDatabase: ddd
            defaultRepository: org.seedstack.mongodb.morphia.Morphia
```

This tells the business framework to consider that every Morphia default repository for aggregate roots in the `org.myorg.myapp.domain.model`
package and its subpackages is bound to the `ddd` database through the `main` client. It also tell that, when injecting the
default repositories of those aggregates, the Morphia implementation should be used by default.

From there, we can simply add Morphia annotations on the domain model and add a private default constructor required by
Morphia. The `Order` entity becomes:

```java
@Entity
public class Order extends BaseAggregateRoot<Long> {
    @Id
    private Long orderId;
    private Long customerId;
    private Date checkoutDate;
    private Map<Long, OrderItem> items = new HashMap<>();
    private double total = 0d;

    public Order(Long orderId, Long customerId) {
        this.orderId = orderId;
        this.customerId = customerId;
    }

    private Order() {
        // required by Morphia
    }

    // ...
}
```

The `OrderItem` value object becomes:

```java
@Embedded
public class OrderItem extends BaseValueObject {
    private long productId;
    private int quantity;
    private double unitaryPrice;

    public OrderItem(long productId, int quantity, double unitaryPrice) {
        this.productId = productId;
        this.quantity = quantity;
        this.unitaryPrice = unitaryPrice;
    }

    private OrderItem() {
        // require by Morphia
    }

    // ...
}
```

The `Product` entity becomes:

```java
@Entity
public class Product extends BaseAggregateRoot<Long> {
    @Id
    private Long productId;
    private String description;
    private double price;

    public Product(long productId, String description, double price) {
        this.productId = productId;
        this.description = description;
        this.price = price;
    }

    private Product() {
        // required by Morphia
    }

    // ...
}
```

The `Seller` entity becomes:

```java
@Entity
public class Seller extends BaseAggregateRoot<Long> {
    public static final int SENIORITY_THRESHOLD = 90;
    public static final long MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

    @Id
    private Long sellerId;
    private Date hireDate;
    private String bonusPolicy = BonusPolicy.PER_ITEM;
    private double monthlyBonus = 0;

    public Seller(long sellerId, Date hireDate) {
        this.sellerId = sellerId;
        this.hireDate = hireDate;
    }

    private Seller() {
        // required by Morphia
    }

    // ...
}
```

