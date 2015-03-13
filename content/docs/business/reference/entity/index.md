---
title: "Entity"
type: "reference"
zones:
    - "Business"
sections:
    - "BusinessEntity"
menu:
    BusinessEntity:
        weight: 10
---

# BaseJpaEntity

Minimum requirements for being a JPA entity are as follows:

- hold a JPA `@Entity` class annotation 
- contain an `@Id` annotation on the identity attribute 
- extend `BaseJpaEntity<ID>` with `ID` being the type of the entity identity
- `getEntityId()` has to return the entity identity
  
Below is a basic Entity example extracted from the ecommerce showcase application domain. The entity is an order Item as 
you could visualize it in any e-shopping website cart. It has an `orderItemId`, a `quantity`, a `productId` and a `price`.

```
package org.mycompany.myapp.domain.model.order;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import org.seedstack.business.jpa.domain.BaseJpaEntity;

/** OrderItem entity */
@Entity
public class OrderItem extends BaseJpaEntity<Long> {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long orderItemId;

	private int quantity;
	private long productId;
	private double price;

	/** Package visibility for build from Factory - interface within the same package */
	OrderItem() {}
	
	@Override
	public Long getEntityId() {
		return orderItemId;
	}
	
	-----8<---------------------
	public getters()/setters();
	--------------------->8-----
}
```

- `OrderItem` is an entity thanks to JPA `@Entity` annotation
- `OrderItem` extends `BaseJpaEntity<Long>` since `Long` is the type of the primary key (`@Id` on `orderItemId` attribute).
- `BaseJpaEntity` is an abstract class extending `BaseEntity` that handles the most generic Entity related behaviour. 
- `getEntityId()` has to return the entity id and is defined in `BaseEntity` as an abstract method to force sub classes 
redefinition.
- ORM takes place according to class (table) and attributes names (columns) while JPA `@Id` and `@GeneratedValue` 
annotations define the primary key and its generation strategy.

<div class="callout callout-info">
<strong>Notice: </strong>SEED offers a
<a href="#!/business-doc/hands-on-domain/factory#entity-identity-management">strategy handling</a> for entity
ids - JPA <code>@GeneratedValue</code> annotation might not be the most up to date way to handle your strategy
on the matter.
</div>

# SimpleJpaEntity

`SimpleJpaEntity` extends `BaseJpaEntity` and provides a `protected entityId` with the associated `getEntityId()` getter. 
Therefore, an entity extending `SimpleJpaEntity` would just have to provide the value of `entityId` to behave similarly 
to above example.

- For instance with a constructor:

```
package org.mycompany.myapp.domain.model.order;

import org.seedstack.business.jpa.domain.id.SimpleJpaEntity;

public class OrderItem extends SimpleJpaEntity<Long> {

	/** Package visibility for build from Factory - interface within the same package */
	OrderItem(Long orderItemId, int quantity, long productId, double price) {
		this.orderItemId = orderItemId;
		this.quantity = quantity;            
		this.productId = productId;
		this.price = price;
		
		// set the entityId handled by SimpleJpaEntity
		this.entityId = orderItemId; /*<------ HERE*/
	}

}		
```

- Or with a setter:
```
package org.mycompany.myapp.domain.model.order;

import org.seedstack.business.jpa.domain.id.SimpleJpaEntity;

public class OrderItem extends SimpleJpaEntity<Long> {

	/** Public if used from Factory */
	public void setEntityId(Long entityId){
		this.entityId=entityId
	}
	
	/** Package visibility for build from Factory - interface within the same package */
	OrderItem(Long orderItemId) {
		this.orderItemId = orderItemId;	

		// set the entityId handled by SimpleJpaEntity
		setEntityId(orderItemId); /*<------ HERE*/
	}

}
```

# EmbedJpaEntity

`EmbedJpaEntity` and `SimpleJpaEntity` are very similar except that the `entityId` provided to `EmbedJpaEntity` 
is defined by a class annotated with `@Embeddable`. For example, a car has a VIN (Vehicle International Number) 
made of 3 parts which is a good candidate for a unique functional `Car` identity (which is a typical Value Object 
as described [later](#!/business-doc/hands-on-domain/value-object#example-2---vin)):

```
package org.mycompany.myapp.domain.model.car;

import org.seedstack.business.jpa.domain.embeddedid.EmbedJpaEntity;

public class Car extends EmbedJpaEntity<VIN> {
    ...
}
```

# Configuration SPI

SEED Business Framework provides an `EntityConfigurationService` allowing to retrieve a specific set of properties for 
entities. This service follows specific semantics and rules that are detailed below.
Below are possible syntaxes using entity props configuration :

```
[*]
[org.mycompany.*]
[org.mycompany.myapp.mydomain1.*]
[org.mycompany.mapp.mydomain1.MyEntity1]
```

* First  `[*]` section refers to all packages. Therefore properties would apply to all entities.
* Second `[org.mycompany.*]` section refers to all packages starting with `org.mycompany.`. Therefore properties would apply
to all entities within that scope.
* Third  `[org.mycompany.myapp.mydomain1.*]` section refers to all packages starting with `org.mycompany.myapp.mydomain1.`.
Therefore properties would apply to all entities within **domain1**.
* Fourth `[org.mycompany.myapp.mydomain1.MyEntity1]` section refers to `MyEntity1` within **domain1**. Therefore properties
would only apply to this entity.

Please refer to [props configuration](#!/seed-doc/core/configuration) for details on sections.
