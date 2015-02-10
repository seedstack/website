Minimum requirement for your value object is to extend `BaseValueObject` abstract class to easily get the generic behaviour of a Value Object.

# Value Object reminder 

As suggested by its name, a **Value Object** is defined by its values, that is **its attributes**. Consequences and uses:

- Two instances of Value Objects having the same attributes are equal
- Once created, a Value Object is immutable and thus can only be read not modified  - ie. **only getters**
- Create meaningful identities (eg. social security number)
- Add meaning to your code :
	- *2 Dates* replaced by a *DateRange* Value Object
	- methods/constructors signatures (eg. `getMeetings(Date, Date, Long)` => `getMeetings(DateRange, Person)`)

# Example 1 - Customer ID

Below Value Object provides an id for a `Customer` entity - the code is adapted from the ecommerce showcase application domain.

> Note the JPA `@Embeddable` class annotation which allows one to use this class an `EmbeddedId` (as expected in [`EmbedJpaEntity`](#!/business-doc/hands-on-domain/aggregate-root#embedjpaentity) 
or [`EmbedJpaAggregateRoot`](#!/business-doc/hands-on-domain/aggregate-root#embedjpaaggregateroot).

```
package org.mycompany.myapp.domain.customer;

import javax.persistence.Embeddable;
import org.seedstack.business.api.domain.base.BaseValueObject;

@Embeddable
public class CustomerId extends BaseValueObject {

    private String value;
     
	/** Constructor with package visibility*/
    CustomerId() {
    }
	/** public Constructor with "the String ID" as param */
    public CustomerId(String customerId) {
        this.value = customerId;
    }
    public String getValue() {
        return value;
    }
}

```

>Possible comment: "Why creating a Value Object that just contains a String?"
>Answer: "To make that String meaningful! You will not be manipulating a String any more but a CustomerId whose data might evolve later... 
That - otherwise meaningless - String appears once in the Value Object constructor signature instead of the rest of your code".

# Example 2 - VIN

See [wikipedia article](http://en.wikipedia.org/wiki/Vehicle_Identification_Number#Components_of_the_VIN) for a description of the "Vehicle Identification Number".
To simplify our example, we will just consider the VIN as composed respectively of 3 successive parts:

- 3 DIGITS : World Manufacturer Identifier
- 6 DIGITS : Vehicle descriptor section
- 8 DIGITS : Vehicle identifier section

> In order to use the `VIN` class as an `entityId` for a Vehicle entity (see [EmbedJpaEntity](#!/business-doc/hands-on-domain/entity#embedjpaentity) / [EmbedJpaAggregateRoot](#!/business-doc/hands-on-domain/aggregate-root#embedjpaaggregateroot)), just add `@Embedded` JPA class annotation.

```
package org.mycompany.myapp.shared.domain.after.sales.vehicle;

import org.seedstack.business.api.domain.base.BaseValueObject;

public class VIN extends BaseValueObject {

	private static final long serialVersionUID = 6230132230538955767L;

	private String worldManufacturerIdentifier;
    private String vehicleDescriptorSection;
    private String vehicleIdentifierSection;
   
    /** Package visibility constructor */
	vehicleIdentificationNumber() {}
	
	/** Public constructor 
	 * @param worldManufacturerIdentifier
	 * @param vehicleDescriptorSection
	 * @param vehicleIdentifierSection
	 */
	public vehicleIdentificationNumber(
			String worldManufacturerIdentifier,
			String vehicleDescriptorSection, 
			String vehicleIdentifierSection) {
		this.worldManufacturerIdentifier = worldManufacturerIdentifier;
		this.vehicleDescriptorSection = vehicleDescriptorSection;
		this.vehicleIdentifierSection = vehicleIdentifierSection;
	}
	
	/** Public constructor
	 * @param vin
	 */
	public vehicleIdentificationNumber(String vin) {
		this.worldManufacturerIdentifier = vin.substring(0,3);
		this.vehicleDescriptorSection = vin.substring(3,9);
		this.vehicleIdentifierSection =  vin.substring(9,17);
	}
	
	/** getters */
	public String getWorldManufacturerIdentifier() {return worldManufacturerIdentifier;}
	public String getVehicleDescriptorSection() {return vehicleDescriptorSection;}
	public String getVehicleIdentifierSection() {return vehicleIdentifierSection;}
	
	@Override
	public String toString(){
		return worldManufacturerIdentifier+ vehicleDescriptorSection+ vehicleIdentifierSection;
	}
}

```
