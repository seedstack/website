---
title: "Assembler DSL"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessAssembler"
menu:
    BusinessAssembler:
        weight: 30
---


Assembler implementations remains simple, but its usage can become
tedious when using lists or complexe worflows. To simplify this use
cases the Business Framework provides a DSL throught
`FluentAssembler`.

# Features

## Lists 

Replace common boilerplate code:

```
List<ProductRepresentation> representations = new ArrayList<>();
for (Product product : products {
    representations.add(productAssembler.assembleDtoFromAggregate(product))
}
```
by oneliners:

```
fluentAssembler.assemble(products).to(ProductRepresentation.class)
```

## Tuples

```
fluentAssembler.assemble(product, order).to(RecipeRepresentation.class)
```

## Qualified assemblers

You can specify the assembler the DSL should use by specifying a
qualifier.
For instance, the following example use the **default ModelMapper
assembler**.
So in this case you don't even have to create an assembler class.

```
fluently.assemble(products).with(AssemblerTypes.MODEL_MAPPER).to(MyDto.class)
```

# Advanced usage

When we merge a representation to an aggregate, the assembler expects
an existing aggregate root instance. Normally you have to retreive
this instance from a repository or to create it from a factory. This
can become a little tedious when you have to do it a lot. Or by adding
few metadata to your DTO, you can have the DSL doing it for you.

## Get an aggregate from its factory

If the aggregate root to merge doesn't exists, you can tell the DSL to
create it from its factory.

```
fluentAssembler.merge(repr).into(Product.class).fromFactory();
```

It will search the aggregate root's factory
(`GenericFactory<Product>`). Then it will search the appropriate
method to call. In order to indicate to the DSL which method should be called,
annotate the DTO's getters matching the factory method's parameters
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

## Get an aggregate from its repository

If the aggregate root to merge already exists, you can tell the DSL to
get it from its repository. If the DSL doesn't find the aggregate root
from the repository, two strategies are possible. The first throw an
exception, the second fall back to the `fromFactory()` method.

```
try {
    product = fluentAssembler.merge(representation).into(Product.class)
        .fromRepository().orFail();
        
} catch (AggregateNotFoundException e) {
    return Response.status(Response.Status.NOT_FOUND).build();
}
```

```
product = fluentAssembler.merge(repr).into(Product.class)
    .fromRepository().thenFromFactory();
```

It will search the aggregate root's repository
(`GenericRepository<Product>`). Then it will call its `load()`
method.
In order to indicate to the DSL how to find the ID, 
annotate the DTO getter matching the aggregate root ID with
`@MatchingEntityId`.

{{% callout info %}}
If the ID is composite annotate the getter
methods matching the ID constructor parameters with
`@MatchingEntityId(index=0)`. In this case, the index is mandatory and
represents the position of the parameters in the constructor method.
{{% /callout %}}

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

    // Getters ...
}
```
