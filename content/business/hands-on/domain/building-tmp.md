

----
----

# Building

## Concepts

The following describes the classes to be extended to build your domain

![Main concepts]({business-doc}/images/business.png)

You can find references to the concepts discussed in the Domain modelisation chapter : 

- **AggregateRoot** used for the entity bearing the aggregate. An aggregateRoot has access to a **DomainEventPublisher** to publish events on the domain.
- **Entity** for the entities composing the aggregate. An entity has an id accessible through *getEntityId* and has its methods *equals()*, *hashcode()* and *toString()* well defined.
- **ValueObject** for value objects. Like entity but without id.
- **Policy** for general rules to be reused in the domain.

Annotations are used by SEED to detect your classes so they can be part of SEED processes (like injections).

Make your classes extend from either concept accordingly.

### base implementation

Base implementation gives default implementation of concepts.

- **BaseAggregateRoot** : The domainEventPublisher is injected by SEED.
- **BaseEntity** : methods *hashcode()*, *equals()* and *toString()* have an implementation based on the ID.
- **BaseValueObject** : methods *hashcode()*, *equals()* and *toString()* have an implementation based on all fields of the class.


### jpa implementation

As an entity is bound to be persisted, SBF uses JPA to describe its persistence. As a result, the first level of inheritance of the domain classes are named after *jpa*. If your entities don't need to be persisted, you can make them extend the classes in the *base* layer.

You can make your class inherit from three jpa classes depending on the nature of their ID :

- **SimpleJpa\*** : the id is a simple type (String, Int, Long...)
- **EmbedJpa\*** : the id is composite and described by a class (which bears the annotation *@Embaddable*).
- **BaseJpa\*** : for a custom id (auto generated long). The class needs to annotate a field with *@Id* !

Your entity needs to be fully described in terms of JPA annotations. Find documentation on the web for more information.

# Building Helpers

## Concepts

The following describes the classes to be extended to build your repositories, factories and finders.

![Main concepts]({business-doc}/images/business-helpers.png)

- **GenericFactory** : interface for factories. To be extended by your factories interfaces. Add the creation methods you need in your interface.
- **GenericRepository** : interface for repositories; has CRUD methods. To be extended by your repositories interfaces.

The annotation *@DomainRepository* is put on the interface *GenericRepository* for detection by SEED and to force a transactional context on the repository.

### Base implementation

Base implementation gives default implementation of concepts.

- **BaseFactory** : Class to be extended by your factories.
- **BaseRepository** : Class to be extended by your repositories if you do not use JPA for your aggregate.

### JPA implementation

- **GenericJpaRepository** : JPA implementation of Repository. If your implementation of repository extends this class, it can come empty. A repository should not have additional methods than the ones already provided : complex read queries should be made by finders.

## Simple Example

Let's create the factory and repository for our *Order* aggregate. We put the interfaces *OrderFactory* and *OrderRepository* in the same package as *Order* and *OrderItem*.

### Factory

Interface

	public interface OrderFactory  extends GenericFactory<Order>{
	    Order createOrder(String customerId, Date checkoutDate, double price, List<Triplet<Integer, Double, Long>> orderItemTriplets);
	}

Note the followings :

- We extend GenericFactory.
- We add our own creation method as generic interface provides none.
- We use a *Triplet* to ease the passing of parameters for OderItems.

Implementation (to be placed in the same package)

	public class OrderFactoryDefault extends BaseFactory<Order> implements OrderFactory {
	
	    @Override
	    public Order createOrder(String customerId, Date checkoutDate, double price, List< Triplet<Integer, Double, Long>> orderItemTriplets) {
	        Order o = new Order();
	        o.setPrice(price);
	        o.setCustomerId(new CustomerId(customerId));
	        o.setCheckoutDate(checkoutDate);
	
	        List<OrderItem> orderItems = new ArrayList<OrderItem>();
	        for (Triplet<Integer, Double, Long> orderItemTriplet : orderItemTriplets) {
	            OrderItem oi = new OrderItem();
	            oi.setPrice(orderItemTriplet.getValue1());
	            oi.setQuantity(orderItemTriplet.getValue0());
	            oi.setProductId(orderItemTriplet.getValue2());
	            orderItems.add(oi);
	        }
	
	        o.setItems(orderItems);
	
	        return o;
	    }
	}

Note the followings :

- We extend BaseFactory.
- It is the responsibility of the factory to create OrderItems as well.

### Repository

Interface

	public interface OrderRepository extends GenericRepository<Order,Long> {
	}

Note the followings :

- We extend GenericRepository.
- No additional methods declared

Jpa implementation (to be put in the infrastructure/persistence package)

	public class OrderJpaRepository extends GenericJpaRepository<Order, Long> implements OrderRepository {
	}

Note the followings :

- We extend GenericJpaRepository.
- No additional methods declared

# Domain Service

Remember a Domain Service only involve **domain logic** and manipulates **domain objects**. It can also be seen as **reusable in another application**. A good example is an Account transfer in banking.

When you create your Domain Service class, annotate it with *@DomainService*

	@DomainService
	public interface MyDomainService {
		
		void myDomainMethod();
	}

	public class MyDefaultDomainService implements MyDomainService {

		public void myDomainMethod(){
		}
	}

Your service will be recognized by SEED; it can be injected where needed :

	@Inject
	private MyDomainService myDomainService;

# Application Service

An application service involves **application logic and behavior** like indexing, reporting, verifying application rules...

When you create your Domain Service class, annotate it with *@ApplicationService*

	@ApplicationService
	public interface MyApplicationService {
		
		void myApplicationMethod();
	}

	public class MyDefaultApplicationService implements MyApplicationService {

		public void myApplicationMethod(){
		}
	}

Your service will be recognized by SEED; it can be injected where needed :

	@Inject
	private MyApplicationService myApplicationService;


# Finder

Finders will be explained in the next chapter.
