---
title: "Value object"
type: "reference"
zones:
    - "Business"
sections:
    - "BusinessValueObject"
menu:
    BusinessValueObject:
        weight: 10
---

Value Objects are objects defined by their attributes. They should
always be used instead of entities wherever possible, e.g. when the
object doesn't have an identity. Value objects are **immutable** and
**comparable**.

To create a value object using the Business framework extends
`BaseValueObject`. It will provide default `equals()`, `hashCode()`
and `compareTo()` methods.

# Usage

## Representing values as a meaningful object

Cars are identified by a "Vehicle Identification Number" (VIN). See
this
[wikipedia article](http://en.wikipedia.org/wiki/Vehicle_Identification_Number#Components_of_the_VIN)
for its description. To simplify our example, we will just consider the VIN as composed respectively of 3 successive parts:

- 3 DIGITS : World Manufacturer Identifier
- 6 DIGITS : Vehicle descriptor section
- 8 DIGITS : Vehicle identifier section

```
package org.mycompany.myapp.shared.domain.after.sales.vehicle;

import org.seedstack.business.api.domain.base.BaseValueObject;

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

```

## Representing identities

Below Value Object provides an id for a `Customer` entity - the code is adapted from the ecommerce showcase application domain.

{{% callout info %}}
Note the JPA `@Embeddable` class annotation which allows one to use this class an `EmbeddedId` (as expected in [`EmbedJpaEntity`](#!/business-doc/hands-on-domain/aggregate-root#embedjpaentity) 
or [`EmbedJpaAggregateRoot`](#!/business-doc/hands-on-domain/aggregate-root#embedjpaaggregateroot).
{{% /callout %}}

```
package org.mycompany.myapp.domain.customer;

import javax.persistence.Embeddable;
import org.seedstack.business.api.domain.base.BaseValueObject;

@Embeddable
public class CustomerId extends BaseValueObject {

    private String value;
     
    public CustomerId(String customerId) {
        this.value = customerId;
    }
    public String getValue() {
        return value;
    }
}

```

You might ask why creating a Value Object
that just contains a String?  The answer is to make that String
meaningful. You will not be manipulating a String any more but a
CustomerId whose data might evolve later. That - otherwise
meaningless - String appears once in the Value Object constructor
signature instead of the rest of your code.
