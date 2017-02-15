---
title: "Domain model"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - "entity"
    - "pattern"
    - "value-object"
    - "service"
    - "model"
    - "identifier"
menu:
    BusinessManual:
        weight: 20
---

The domain model is expressed through three patterns:

* **Entity** which is an object defined primarily by its identity.
* **Value Object** which is an object with no conceptual identity and solely defined by is attributes.
* **Service** which hold domain logic that doesn't clearly belong to an entity nor a value object.<!--more-->

# Entities

Entities are used to represent a domain concept which has an identity.

Often DDD beginners have a tendency to focus more on data than on the software. This often leads in all the concepts of
the "domain" being coded as entities. Specially, in anemic entities using only getters and setters. Using them is not
wrong but it's not enough to hold the insights of a domain. That's why designing entities should be taken very carefully.

The entity concept should be used for an element of your domain when you take care of its identity. An identity must be
unique and immutable. Even it an object can change during its lifetime, its identity must stay untouched. If this is not
true for your element, you should consider using a [value object](#value-objects) instead.

When designing an entity, the critical part is to determine what is the identity and how to create it. An identity can be
hold by a set of properties. In this case, a value object can be well fitted to guaranty the identity consistency and immutability.

There are different kind of creation strategies for identities:

* The client can pass values handling himself the uniqueness.
* The application can generate the identity using an algorithm.
* The application can rely on an external identity generator, like a database sequence.

The first case is easily handled using factories. The other cases, can be usually more complicated, but the Business
framework provides an API for them (see [identity generation]({{< ref "docs/business/manual/factories.md#identity-generation" >}})).

## Declaration

To create an Entity using the Business framework you have three choices:

* Extend the `BaseEntity` class. The `equals()` and `hashCode()` methods will be provided out-of-the-box as well as a basic  `toString()` method. You must implement the `getEntityId()` method.
* Implement the `Entity` interface. You must implement the `equals()`, `hashCode()` and `getEntityId()` 
methods in this case.
* Simply annotate any class with the `@DomainEntity` annotation. In this case, you won't be able to use helpers and 
tools from the framework.

With the two first options (base class and interface), you have to provide a generic parameter with the type of the
Entity identifier.

## Example

Consider the following example in which a `Customer` Entity is identified by an e-mail of String type. 

```
public class Customer extends BaseEntity<String> {
    private String email;
    private Address address;

    public Customer (String email) {
        this.email = email;
    }

    @Override
    public String getEntityId() {
        return this.email;
    }

    /* Meaningful methods */
    public void changeAddress(Address newAddress) { ... }

    /* Getters */
    public Address getAddress() { ... }
    public String getEmail() { ... }
    public List<Order> getOrders() { ... }
    
    /* Try to avoid setters as they allow to alter the internal state of the entity */
}
```

# Value-Objects

An object that don't have a conceptual identity but is just describing some characteristics of a thing is called a
Value Object. Because the most visible objects in a model are usually Entities, there is a natural tendency to assign
an identity to every domain object. But this tendency should be refrained. Here are the main characteristics of a
Value Object:

* It measures, quantifies or describes a thing in the domain.
* It is immutable, meaning that its state cannot be changed after creation.
* It describes a conceptual whole. Its attributes are related to each other and are all participating to the description.
This means that all the required values should be assigned upon creation (i.e. in the constructor).
* It is comparable to others using value equality.
* Its behavior is side-effect free.


## Declaration

To create a Value Object using the Business framework you have three choices:

* Extend the `BaseValueObject` class. In this case, the `equals()`, `hashCode()` methods will be
provided out-of-the-box as well as a basic `toString()` method.
* Implement the `ValueObject` interface. You must implement the `equals()` and `hashCode()` in this case.
* Simply annotate any class with the `@DomainValueObject` annotation. In this case, you won't be able to use helpers and
tools from the framework.

## Example

Cars are identified by a "Vehicle Identification Number" (VIN). See this [wikipedia article](http://en.wikipedia.org/wiki/Vehicle_Identification_Number#Components_of_the_VIN)
for the conceptual definition. To simplify our example, we will just consider the VIN as composed respectively of 3 parts:

* 3 DIGITS : World Manufacturer Identifier
* 6 DIGITS : Vehicle descriptor section
* 8 DIGITS : Vehicle identifier section

Here is a possible implementation of the VIN class:

	package org.mycompany.myapp.shared.domain.after.sales.vehicle;

	import org.seedstack.business.domain.BaseValueObject;

	public class VIN extends BaseValueObject {
		private final String worldManufacturerIdentifier;
		private final String vehicleDescriptorSection;
		private final String vehicleIdentifierSection;

		public vehicleIdentificationNumber(
				String worldManufacturerIdentifier,
				String vehicleDescriptorSection,
				String vehicleIdentifierSection) {
			this.worldManufacturerIdentifier = worldManufacturerIdentifier;
			this.vehicleDescriptorSection = vehicleDescriptorSection;
			this.vehicleIdentifierSection = vehicleIdentifierSection;
		}

		public vehicleIdentificationNumber(String vin) {
			this.worldManufacturerIdentifier = vin.substring(0,3);
			this.vehicleDescriptorSection = vin.substring(3,9);
			this.vehicleIdentifierSection = vin.substring(9,17);
		}

		/* Getters */
		public String getWorldManufacturerIdentifier() { ... }
		public String getVehicleDescriptorSection() { ... }
		public String getVehicleIdentifierSection() { ... }

		@Override
		public String toString(){
			return worldManufacturerIdentifier + vehicleDescriptorSection
					+ vehicleIdentifierSection;
		}
	}

## Usage as identifiers

Value Object can also be used to represent complex identifiers for entities. For instance, you can use the VIN class defined
in the example above to identity a `Vehicle` class. You can also add meaning and behavior to a simple value by embedding
it into a Value Object:

	package org.mycompany.myapp.domain.customer;

	import javax.persistence.Embeddable;
	import org.seedstack.business.domain.BaseValueObject;

	public class CustomerId extends BaseValueObject {
		private String value;

		public CustomerId(String customerId) {
			this.value = customerId;
		}
		public String getValue() {
			return value;
		}
	}

In this example, the `CustomerId` Value Object add meaning to the plain string. You won't manipulate a String anymore
in your code but a CustomerId, with its own type. This type can evolve later to provide additional behavior or to
be adapt its internal structure.

# Services

Services are stateless objects that implement logic which doesn't fit in the aggregates.

Services can be found in various locations:

* The domain, where services contain pure business logic. Naming should come from the {{< term "ubiquitous language" >}} or
be introduced into it if necessary. Parameters and return values should be domain objects. Example: a bank account transfer service.
* The infrastructure, where services deal with specific technological aspects. Example: a notification sending service.
* The application, where services contain coordination logic between other services and are more tied to a specific use-case.
These services are often the ideal place to begin and end a transaction.

{{% callout info %}}
A good service is always stateless. That doesn't mean that a service cannot change the global state of the application
(that is, it may have side effects), but it should never hold a state of its own that could affect its behavior.
{{% /callout %}}

## Declaration

Creating a Service with the Business Framework, consists in:

* Creating a service interface, annotated with the `@Service` annotation. Business Framework Services are POJOs, there is no mandated super interface.
* Creating a service implementation.

## Example

Let's consider a bank account transfer, which is a service belonging to the domain.

* From the domain of a *bank account management* perspective, the transfer consists of an amount debited on an
account which is credited on another account.
* The inherent logic of the transfer does not belong to any of the accounts but to a service of the Domain.
It's implementation can be rather simple or complex depending on the rules applying to the process (currency exchange
rate, transfer authorisation between countries, amount on originating account, etc...).

```
@Service
public interface AccountTransferService {

    public AccountTransferReport transferMoney(Account toBeDebited, Account toBeCredited,
            Amount transferAmount);

}
```

{{% callout info %}}
Avoid services named like "AccountManagement" as they tend to become the place to handle all behaviour for a (sub)domain
instead of clearly specifying the intent and responsibility.
{{% /callout %}}
