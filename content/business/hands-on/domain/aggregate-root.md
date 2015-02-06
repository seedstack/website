Since `AggregateRoot` is a sub interface of `Entity` and aggregate root implementations extend corresponding entity 
implementations (`BaseJpa*`, `SimpleJpa*`, `EmbedJpa*`), everything 
[previously described](#!/business-doc/hands-on-domain/entity#basejpaentity) for entities also applies to aggregate roots.

# BaseJpaAggregateRoot

Following the `OrderItem ` entity example, we guess that the root of an aggregate containing such an entity is an `Order`
entity. Below is an aggregate root example extracted from the ecommerce showcase application domain. 

> `Order` entity and an `OrderItem ` entity have a one to many relationship.

```
import org.seedstack.business.jpa.domain.BaseJpaAggregateRoot;
import org.mycompany.ecommerce.domain.customer.CustomerId;

@Entity
@Table(name = "THE_ORDER")
public class Order extends BaseJpaAggregateRoot<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long orderId;
    
    private CustomerId customerId;
    
    private Date checkoutDate;
    
    @OneToMany(cascade = {CascadeType.ALL,CascadeType.PERSIST})
    private List<OrderItem> items;
    
    private double price;

    /** Package visibility for build from Factory - interface within the same package */
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
	-----8<---------------------
	public getters()/setters();
    --------------------->8-----    
}

```

- `BaseJpaAggregateRoot` is an abstract class extending `BaseAggregateRoot` (itself extending `BaseEntity` and 
implementing `AggregateRoot` interface which holds the `@DomainAggregateRoot` annotation handled by SEED). 
- ORM takes place according to JPA `@Table` class annotation and attributes names (columns) while `@Id` and 
`@GeneratedValue` annotations define the primary key and its generation strategy.
- `Order` is an `BaseJpaAggregateRoot` of type `Long` since its primary key is mapped on `orderId` attribute. 
It holds an aggregate containing a list of `OrderItem`s and will allow this aggregate to be treated transactionally 
(in terms of CRUD - through a [repository](#!/business-doc/hands-on-domain/repository)).

> SEED offers a [strategy handling](#!/business-doc/hands-on-domain/factory#entity-identity-management) for entity ids - JPA 
`@GeneratedValue` annotation might not be the most up to date way to handle your strategy on the matter.

# SimpleJpaAggregateRoot

```
import org.mycompany.myapp.domain.simple.SimpleJpaAggregateRoot;

@Entity
public class AggregateRoot extends SimpleJpaAggregateRoot<TypeOfRootId> {
    ...
}
```

Just provide an `entityId`. See `SimpleJpaEntity` towards `BaseJpaEntity` [here](#!/business-doc/hands-on-domain/entity#simplejpaentity).
The `entityId` id of type `TypeOfRootId` is unique identifier for the whole aggregate (eg. the `Long` id of an Order 
containing all of it's items, potentially a promotion code or any other entity belonging to the aggregate).

# EmbedJpaAggregateRoot

```
import org.mycompany.myapp.domain.myagg.EmbedJpaAggregateRoot;

@Entity
public class AggregateRoot extends EmbedJpaAggregateRoot<TypeOfRootId> {
   ...
}
```

Similar to `SimpleJpaAggregateRoot`, just provide an `@Embeddable` annotated class as `entityId`. 
See `EmbedJpaEntity` towards `SimpleJpaEntity` [here](#!/business-doc/hands-on-domain/entity#embedjpaentity).
