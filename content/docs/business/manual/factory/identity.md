---
title: "Identity management"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessFactory"
menu:
    BusinessFactory:
        weight: 20
---

Factories provide methods to create entities with a well defined identity. But sometimes, you want to delegate the identity
creation, for instance to an Oracle sequence. For this use case Seed provides an **identity generation strategies**. 
A generation strategy makes sure a unique identity is provided to any new Entity before it is even persisted.

# Use identity strategy

The identity strategy feature requires both a strategy/behaviour and an implementation. The implementation can be either of the 
`IdentityHandler` super interface or an intermediate "Named" (according to behaviour) interface (See 
[SPI documentation](#custom-identity-handler)).

* In every case, the `IdentityHandler` interface should be used.
  
* The implementation is provided through direct class configuration where the name of the class or the name of an
enclosing package is specified directly in the configuration. Use the **identity.handler-qualifier** key to 
specify the implementation qualifier (`@Named` class annotation, e.g. "timestamp-id" in above code).

The implementation can also be directly referred to, but it is not recommended as it's not part of the domain.

# Example

Below is an aggregate using the identity strategy: 

```
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

```
package org.mycompany.myapp.domain.model.myaggregate;

public class MyEntity extends BaseEntity<UUID> {

    @Identity(handler = SequenceHandler.class)
    private UUID id;
}
```

`@Identity` annotation has to apply on the Entity identity attribute. This annotation takes two arguments:

- `handler`: strategy implementation
- `source`: a String that can be used in a custom handler. For instance, it could provide a SEQUENCE name for DB.

## Configuration
	
	[org.mycompany.myapp.domain.model.myaggregate.MyAggregate]
	identity.handler-qualifier = simple-UUID

	[org.mycompany.myapp.domain.model.myaggregate.MyEntity]
	identity.handler-qualifier = oracle-sequence
	identity.sequence-name = SEQ_TEST

## Factory

Below is a Factory interface for above `MyAggregate` Class:

```
package org.mycompany.myapp.domain.model.myaggregate;

import org.seedstack.business.api.domain.GenericFactory;
import org.seedstack.business.api.domain.stereotypes.Create;

public interface MyAggregateFactory  extends GenericFactory<MyAggregate> {
    
    MyAggregate createMyAggregate(String name);
}
```

Below is a Factory implementation for above `MyAggregateFactory` interface:

```
package org.mycompany.myapp.domain.model.myaggregate;

import org.seedstack.business.api.domain.stereotypes.Create;
import org.seedstack.business.api.domain.BaseFactory;

public class MyAggregateFactoryDefault extends BaseFactory<MyAggregate>
        implements MyAggregateFactory {

    @Create
    @Override
    public MyAggregate createMyAggregate(String name) {
        MyAggregate myAggregate = new MyAggregate();
        myAggregate.setName(name);

        MyEntity mySubAggregate = createMySubEntity();
        myAggregate.setMySubAggregate(mySubAggregate);

        return myAggregate;
    }

    @Create
    MyEntity createMySubEntity() {
        return new MyEntity();
    }
}
```

# How it works

- Only annotated methods with `@Create` are intercepted for id generation (**Except if the method is private**)
- Id generations only applies to the generated Entity (not sub entities) - one "create method" is required for each 
Entity requiring id generation

{{% callout info %}}
If all factory methods delegate id generation to Seed, `@Create` annotation can apply at class or interface level.

Alternatively, you can inject `IdentityService` to programatically and individually generate an identity on compliant 
entities (id attribute annotated with `@Identity`) as in following test.
{{% /callout %}} 

```
@RunWith(SeedITRunner.class)
public class IdentityServiceIT {

    @Inject
    IdentityService identityService;
	
    @Test
    public void identify_entity() {
        MyAggregate myAggregate = new MyAggregate();
        identityService.identify(myAggregate);
        Assertions.assertThat(myAggregate.getEntityId()).isNotNull();
    }

    ...
}
```

# Custom identity handler

![identity-seed](/img/business/manage-entity-spi.svg)

Two different options are available to define custom identity handlers:

![identity-seed](/img/business/manage-entity-usage.png)

Below is an example of a basic Timestamp id generation strategy:

```
package org.mycompany.myapp.infrastructure.domain;

import org.seedstack.business.api.domain.BaseEntity;
import org.seedstack.business.api.domain.identity.IdentityHandler;

@Named("timestamp-id")
public class TimestampIdentityHandler implements IdentityHandler<BaseEntity<Long>, Long> {

    @Override
    public Long handle(BaseEntity<Long> entity, Map<String, String> entityConfig) {
        return new Date().getTime();
    }
}
```

# Provided identity strategies

## SequenceHandler

Handles sequence generated ID. Two implementations are provided:

* `OracleSequenceHandler`: Get next oracle sequence value for new entity id. The following properties.

```
[org.mycompany.myapp...YourEntity]
identity.handler-qualifier = oracle-sequence
identity.sequence-name = your_sequence_name
```

* `InMemorySequenceHandler`: To be used **ONLY** for testing (preserves behaviour without a database). The following 
properties.

```
[org.mycompany.myapp...YourEntity]
identity.handler-qualifier = inmemory-sequence
```

## UUIDHandler

Use for handling UUID generated ID. One implementation is provided:

* `SimpleUUIDHandler`: Get new random UUID from java.util.UUID.randomUUID(). Need one property using entity props 
configuration:

```
[org.mycompany.myapp...YourEntity]
identity.handler-qualifier = simple-UUID 
```

For a full description of Entity properties configuration, refer to this 
[documentation](#!/business-doc/hands-on-domain/entity#configuration-spi).
