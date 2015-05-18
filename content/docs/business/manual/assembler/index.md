---
title: "Assembler"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessAssembler"
menu:
    BusinessAssembler:
        weight: 10
---

The assembler pattern is used to transfer a representation of the
state of *Aggregates* to *DTO/Representation* objects. The Business
Framework provides a interface and few base classes to ease the
development of assemblers.

# Usage

Create an assembler extending `BaseAssembler` class. It will contains
the code the logic of the copy of the data from/to the
aggregate. Then, inject your assembler in your class and you use it.

There are two method to implement:

- `doAssembleDtoFromAggregate(dto, aggregate)` 
- `doMergeAggregateWithDto(aggregate, dto)`

The first method creates a DTO from an aggregate root. The second
merge the mutable fields of an **existing** aggregate with the data
from the dto. This means for instance that it should never change the
aggregate identity.

# Example

An assembler assembling a representation of a product.

```
public class ProductAssembler extends BaseAssembler<Product,ProductRepresentation> {

    @Override
    protected void doAssembleDtoFromAggregate(ProductRepresentation targetDto, 
	         Product sourceAggregate) {
	    // Flatten the id
        targetDto.setStoreId(sourceAggregate.getAggregateId().getStoreId());
        targetDto.setProductCode(sourceAggregate.getAggregateId().getProductCode());
         
		targetDto.setName(sourceAggregate.getName());
	    targetDto.setDescription(sourceAggregate.getDescription());
    }
	 
    @Override
    protected void doMergeAggregateWithDto(Product targetAggregate, 
	        ProductRepresentation sourceDto) {
        // The id is not modified
	    targetAggregate.setName(sourceDto.getName());
        targetAggregate.setDescription(sourceDto.getDescription());
    }
}
```

You can inject the assembler via its interface or directly via the
implementation classe. Both way are acceptable, but the first way
provides a more encapsulated interface to the developer using it.

```
@Inject
Assembler<Product, ProductRepresentation> productAssembler;

@Inject
ProductAssembler productAssembler;
```

Then,

```
// assemble a representation
representation = productAssembler.assembleDtoFromAggregate(product);

// merge an aggregate
Product productToMerge = catalog.retrieve(productId);
productAssembler.mergeAggregateWithDto(productToMerge, productRepresentationSource);
catalog.update(productToMerge);
```

# FluentAssembler DSL

Assemblers implementation remains simple, but its usage can become
tedious when using list or complexe worflows. For simplify this use
cases the Business Framework provides a DSL throught
`FluentAssembler`.

## Aggregate to DTO

```
fluentAssembler.assemble().aggregate(aProduct).to(ProductRepresentation.class)

// with list
fluentAssembler.assemble().aggregates(productList).to(ProductRepresentation.class)
```

## DTO to aggregate

```
Product aProduct = fluentAssembler.assemble().dto(productRepresentation).to(aProduct)

// with list
Product aProduct = fluentAssembler.assemble().dtos(representationList).to(productList)
```

## Advanced usage

When we merge a representation to an aggregate, the assembler expects
an existing aggregate root instance. Normally you have to retreive
this instance from a repository or to create it from a factory. This
can become a little tedious when you have to do it a lot. In this
case, by adding few metadata to your DTO/Representation class, you can
have the DSL to doing it for you.

### Get aggregates from factory

If the aggregate root to merge doesn't exists, you can tell the DSL to
create from the factory.

```
fluentAssembler.assemble().dto(repr).to(Product.class).fromFactory();
```

It will search a factory for the aggregate root to merge
(`GenericFactory<Product>`). Then it will search the appropriate
method to call. To indicate to the DSL which method should be called,
annotate the DTO getter methods matching the factory method parameters
with `@MatchingFactoryParameter(index=0)`. The index represents the
position of the parameters in the factory method.

```
public class ProductRepesentation {

    private Short storeId;
    private Short productCode;
    private String name;
    private String description

    @MatchingFactoryParameter(index=0)
    public Short getStoreId() { ... }

    @MatchingFactoryParameter(index=1)
    public Short getProductCode() { ... }

    @MatchingFactoryParameter(index=2)
    public Short getName() { ... }

    public Short getDescription() { ... }
}
```

```
public interface ProductFactory extends GenericFactory<Product> {
	
	Product createProduct(Short storeId, Short productCode, String name);
}
```

### Get aggregate from repository

If the aggregate root to merge already exists, you can tell the DSL to
get it from the repository. If the DSL doesn't find the aggregate root
from the repository, two strategies are possible. The first throw an
exception, the second fall back to the `fromFactory()` method.

```
try {
    product = fluentAssembler.assemble().dto(representation)
        .to(Product.class).fromRepository().orFail();
} catch (AggregateNotFoundException e) {
    return Response.status(Response.Status.NOT_FOUND).build();
}
```

```
product = fluentAssembler.assemble().dto(repr).to(Product.class)
    .fromRepository().thenFromFactory();
```

It will search a repository for the aggregate root to merge
(`GenericRepository<Product>`). Then it will search the appropriate
method to call. To indicate to the DSL which method should be called,
annotate the DTO getter method matching the aggregate root ID with
`@MatchingEntityId`. If the ID is composite annotate the getter
methods matching the ID constructor parameters with
`@MatchingEntityId(index=0)`. In this case, the index is mandatory and
represents the position of the parameters in the constructor method.

```
public class ProductRepesentation {

    private Short storeId;
    private Short productCode;
    private String name;
    private String description

    @MatchingEntityId(index=0)
    public Short getStoreId() { ... }

    @MatchingEntityId(index=1)
    public Short getProductCode() { ... }

    public Short getName() { ... }

    public Short getDescription() { ... }
}
```

```
public class ProductId extends BaseValueObject {

	private Short storeId;
	private Short productCode;
	
	public ProductId(Short storeId, Short productCode) {
		this.storeId = storeId;
		this.productCode = productCode;
	}

    // Getters
    ...
}
```
