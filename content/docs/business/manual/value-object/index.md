---
title: "Value object"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessValueObject"
menu:
    BusinessValueObject:
        weight: 10
---

Value Objects are objects defined by their attributes. They should always be used instead of entities wherever possible, 
e.g. when the object doesn't have an identity. Value objects are **immutable** and **comparable**.

{{% callout info %}}
This page describes how to implement **Value Objects** with the Business framework. To know more about the Value Object
concept, refer to [this section](../../concepts/domain-model/#value-object).
{{% /callout %}}

# Usage 

To create a Value Object using the Business framework you have three choices:

* Extend the `BaseValueObject` class. In this case, the `equals()`, `hashCode()` and `compareTo()` methods will be 
provided out-of-the-box.
* Implement the `ValueObject` interface. You must implement the `equals()`, `hashCode()` and `compareTo()` methods in
this case.
* Simply annotate any class with the `@DomainValueObject` annotation. In this case, you won't be able to use helpers and 
tools from the framework.

# Example

Cars are identified by a "Vehicle Identification Number" (VIN). See this [wikipedia article](http://en.wikipedia.org/wiki/Vehicle_Identification_Number#Components_of_the_VIN)
for the conceptual definition. To simplify our example, we will just consider the VIN as composed respectively of 3 parts:

* 3 DIGITS : World Manufacturer Identifier
* 6 DIGITS : Vehicle descriptor section
* 8 DIGITS : Vehicle identifier section

Here is a possible implementation of the VIN class:

	package org.mycompany.myapp.shared.domain.after.sales.vehicle;
	
	import org.seedstack.business.api.domain.BaseValueObject;
	
	public class VIN extends BaseValueObject {
		private static final long serialVersionUID = 6230132230538955767L;
	
		private String worldManufacturerIdentifier;
		private String vehicleDescriptorSection;
		private String vehicleIdentifierSection;
	   
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
	
		/* Notice that there is no setters to guaranty the immutability */
	
		@Override
		public String toString(){
			return worldManufacturerIdentifier + vehicleDescriptorSection
					+ vehicleIdentifierSection;
		}
	}

# Usage as identifiers

Value Object can also be used to represent complex identifiers for entities. For instance, you can use the VIN class defined
in the example above to identity a `Vehicle` class. You can also add meaning and behavior to a simple value by embedding
it into a Value Object: 

	package org.mycompany.myapp.domain.customer;
	
	import javax.persistence.Embeddable;
	import org.seedstack.business.api.domain.BaseValueObject;
	
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
