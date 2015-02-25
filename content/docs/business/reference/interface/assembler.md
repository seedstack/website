---
title: "Assembler"
type: "reference"
zones:
    - "Business"
sections:
    - "BusinessInterfaceLayer"
menu:
    BusinessInterfaceLayer:
        weight: 40
---

The assembler pattern is used to transfer the state of *Aggregates* to *DTO/Representation* objects. Here is the 
interface of a SEED assembler:

```
/**
 * This interface represents the Assembler concepts between an aggregate and a DTO.
 * <p/>
 * This is a helper to transform an aggregate to a DTO and vice versa.
 * <p/>
 * Underlying class will have to provide the gateway implementation.
 *
 * @param <AggregateRoot>     the aggregate root
 * @param <Dto>               the dto type
 * @param <AggregateRootType> the aggregate root class type
 */
public interface Assembler<AggregateRoot, Dto, AggregateRootType extends Type> {

    /**
     * Creates a new DTO and fill it from the aggregate.
     *
     * @param sourceAggregate The aggregate to copy data from.
     * @return a DTO type
     */
    Dto assembleDtoFromAggregate(AggregateRoot sourceAggregate);

    /**
     * Updates the given DTO from the aggregate.
     *
     * @param sourceDto       The dto to update.
     * @param sourceAggregate The aggregate to copy data from.
     */
    void updateDtoFromAggregate(Dto sourceDto, AggregateRoot sourceAggregate);

    /**
     * Merges a source DTO into an existing aggregate.
     *
     * @param targetAggregate The aggregate to merge.
     * @param sourceDto       The dto to copy data from.
     */
    void mergeAggregateWithDto(AggregateRoot targetAggregate, Dto sourceDto);

    ... 8< ...

}
```

This interface contains two other methods that is needed by others SEED components `AggregateRootType getAggregateClass()`
 and `Class<Dto> getDtoClass()`. 

# BaseAssembler, the class to extends

To ease the creation of Assembler, you won't have to implement this interface directly, a simpler way is to extends 
`BaseAssembler`. You'll have only 2 methods to extends.

- `doAssembleDtoFromAggregate(dto, aggregate)` to create a DTO from an aggregate root 
- `doMergeAggregateWithDto(aggregate, dto)` to merge the mutable fields of an **existing** aggregate with the data from the dto.

## Usage

Create an assembler extending *BaseAssembler* class. It will contains the code the logic of the copy of the data from/to 
the aggregate. Then, inject your assembler in your class and you use it.

## Example

One Assembler for Product.

```
public class ProductAssembler extends BaseAssembler<Product,ProductRepresentation> {

    @Inject
    private ProductFactory productFactory;

    @Override
    protected void doAssembleDtoFromAggregate(ProductRepresentation targetDto, 
	         Product sourceAggregate) {
	    // Create a ProductId value object   
	    ProductId id = productFactory.createId(sourceAggregate.getAggregateId().getStoreId(), 
            sourceAggregate.getAggregateId().getProductCode());
         
        // assemble the DTO
		targetDto.setProductId(id);
		targetDto.setName(sourceAggregate.getName());
	    targetDto.setDescription(sourceAggregate.getDescription());
    }
	 
    @Override
    protected void doMergeAggregateWithDto(Product targetAggregate, 
	        ProductRepresentation sourceDto) {
	    targetAggregate.setName(sourceDto.getName());
        targetAggregate.setDescription(sourceDto.getDescription());
    }
}
```

Injection of the assembler.

```
@Inject
ProductAssembler productAssembler;
```

Use of your assembler.

```
ProductRepresentation productRepresentation = 
	productAssembler.assembleDtoFromAggregate(productFromRepo);
```

```
Product productToMerge = getFromSomewhere();
productAssembler.mergeAggregateWithDto(productToMerge, productRepresentationSource);
```

# Assemblers, the swiss army knife for assembler

Assemblers is a helper which prevent you a lot of common tasks when working around Assembler. It encapsulates the 
following features :

- `assembleDtoFromAggregate` to create a dto from an aggregate
- `createUniversalDtoFromAggregate` to create a `UniversalDto` from an aggregate
- `mergeAggregateWithDto` to merge the mutable fields of an **existing** aggregate with the data from the dto
- `createThenMergeAggregateWithDto` calls the factory to create a **new** aggregate with data from the dto
- `retrieveThenMergeAggregateWithDto` finds the aggregate and merges it with the data from the dto
- `retrieveOrCreateThenMergeAggregateWithDto` tries to find the aggregate, if it does not exist, creates it, and then merges 
its fields with the dto

# Advanced use of Assemblers

By adding some more configuration to your DTO class, you can have assemblers to do more for you:

- Find an existing aggregate to merge to the dto
- Call the factory to create a new aggregate from the dto

Here is how to tell the assembler which methods of the DTO match the aggregate ID and which match the factory methods:

## @MatchingAggregateId

Use the`@MatchingAggregateId` annotation on DTO method getter that matches the constructor of the ID of the aggregate. 
If methods return type are of the same types, use the *order* parameter of the annotation to remove ambiguities.

## @MatchingFactoryParameter

Use `@MatchingFactoryParameter` annotation on DTO method getter that matches the parameters of the aggregate factory method. 
If methods return type are of the same types, use the *order* parameter of the annotation to remove ambiguities.


## Example

For a *Product* Aggregate with a *ProductId* made of two `Short` objects (domain layer):

```
@Embeddable
public class ProductId extends BaseValueObject
{
	/**
	 * between 0 and 1000
	 */
	private Short storeId;
	private Short productCode;
	
	ProductId() 
	{
	}
	
	public ProductId(Short storeId , Short productCode) {
		this.storeId = storeId;
		this.productCode = productCode;
	}
	--------------8<----------
	Get/set
	--------------8<----------
}
```

The *factory* (domain layer):

```
public interface ProductFactory extends GenericFactory<Product> {
	
	Product createProduct ( Short storeId , Short productCode );
}
```

In the *ProductDto* (interface layer):

```
public class ProductDto {

	private Short storeId;
	private Short productCode;

	@MatchingAggregateId (order=0)
	@MatchingFactoryParameter(order=0)
	public Short getStoreId() {
		return storeId;
	}
	
	@MatchingAggregateId (order=1)
	@MatchingFactoryParameter(order=1)
	public Short getProductCode() {
		return productCode;
	}
}
```

Inject the class **Assemblers** in your class (interfaces layer):

```
@Inject
private Assemblers assemblers;
```

- Use the provided methods (interfaces layer):

```
Product p = assemblers.retrieveThenMergeAggregateWithDto (productDTO , Product.class);
Product p = assemblers.createThenMergeAggregateWithDto (productDTO , Product.class);
```
# UniversalDto

## Description

Sometimes the domain is made of **many Aggregates** where each contains **one or two entities**. The creation of 
assemblers for each aggregate can get tedious. In this case, you can use UniversalDto.

- UniversalDto is an Object that will convert your aggregate into a property/value map that can be seen as a DTO.
- UniversalDto is easily converted into JSON.

## Usage

Inject *Assemblers helper* in your class (interface layer).

```
@Inject
private Assemblers assemblers;
```

Create the universalDto from your aggregate (interface layer).

```
UniversalDto dto = assemblers.createUniversalDtoFromAggregate(aggregate);
```
