---
title: "Assemblers"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - "dto"
    - "mapping"
    - "object"
    - "aggregate"
    - "factory"
    - "repository"
menu:
    BusinessManual:
        weight: 60
---

The assembler pattern is used to transfer a representation of the state of *Aggregates* to *DTO/Representation* objects. 
The Business Framework provides a interface and few base classes to ease the development of assemblers.

# Default assembler

By default, if your mapping is obvious, you don't have to create an explicit assembler. You just add the `@DtoOf` annotation
on your DTO class to link them to their related Aggregate root:

    @DtoOf(Product.class)
    class ProductRepresentation {
        ...
    }

You can then inject a ModelMapper-based assembler with the `@ModelMapper` annotation:

    @Inject
    @ModelMapper
    Assembler<Product, ProductRepresentation> productAssembler;

This assembler uses the default settings of the [ModelMapper library](http://modelmapper.org/).
 
{{% callout warning %}}
It is strongly recommended to always have a DTO. **Never serialize domain objects to your clients.** Even with the default
assembler you can define a DTO that is a flat and/or partial mapping of your domain Aggregate. ModelMapper will
automatically figure out the field mapping if you respect [their conventions](http://modelmapper.org/getting-started/#mapping).
Besides, you should always have integration tests that checks that the automatic mapping is correct.
{{% /callout %}}

# Explicit assembler

Create an assembler extending `BaseAssembler` class. It will contains
the logic of the copy between aggregate and DTO. Then, inject your
assembler in your class.

There are two methods to implement:

- `doAssembleDtoFromAggregate(dto, aggregate)` 
- `doMergeAggregateWithDto(aggregate, dto)`

The first method creates a DTO from an aggregate root. The second
merge the mutable fields of an **existing** aggregate with the data
from the dto.

{{% callout info %}}
Note that the aggregate identity should never be updated by the DTO.
{{% /callout %}}

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
implementation class. Both way are acceptable, but the first way
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

# Domain-Specific Language

Assembler implementations remains simple, but its usage can become
tedious when using lists or complexe worflows. To simplify this use
cases the Business Framework provides a DSL throught
`FluentAssembler`.

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

## Advanced usage

When we merge a representation to an aggregate, the assembler expects
an existing aggregate root instance. Normally you have to retreive
this instance from a repository or to create it from a factory. This
can become a little tedious when you have to do it a lot. Or by adding
few metadata to your DTO, you can have the DSL doing it for you.

### Get an aggregate from its factory

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

### Get an aggregate from its repository

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

# Automation with ModelMapper

DTOs are meant to expose domain objects or a part of these objects.
So there are often similarities between the DTOs and the domain
object.
This can lead to a lot of boilerplate code when the assembler doesn't
hold complex logic but just populates objects.

For this use case, you can now **use a default** assembler based on
[ModelMapper](http://modelmapper.org/). It's an *automatic assembler*
which provides an **intelligent mapping**.

## How to use it ?

The only thing you have to do is to annotate the DTO with
`@DtoOf(MyAggregate.class)`. It tells the framework to bind a default
assembler for assembling `MyAggregate` into the annotated DTO.
After you can inject the assembler as follows, and use it as usual.

```
@DtoOf(MyProduct.class)
public class MyDto { ... }
```

```
@Inject
@ModelMapper
private Assembler<MyAggregate,MyDto> myDtoAssemebler;
```

## How does it work ?

It uses a intelligent mapping provided by the ModelMapper library.
You can find the detailed explanation here
[matching documentation](http://modelmapper.org/user-manual/how-it-works/).

## Can I customize it ?

Yes. If there are ambiguities, or if you only want to change the mapping of
one field, you don't need to fall back to the old assembler. You can
just create an assembler extending the `ModelMapperAssembler` class and
implement the methods returning a `ModelMapper` instance.

{{% callout info %}}
See here [how to override the mapping](http://modelmapper.org/user-manual/property-mapping/).
{{% /callout %}}

It supports:

 - Deep mapping
 - Skipping properties
 - Providers
 - Conditional mapping
 - String mapping

### Can I see some code ?

Below is an example from the [Web application sample](https://github.com/seedstack/store-webapp-sample).
The Product contains a field `entityId` and a field `categoryId`, but the representation only contains a field
`id`. So ModelMapper doesn't know which field match.

To fix this, extend `ModelMapperAssembler` and add a `PropertyMap` to the `modelMapper`.

{{% callout info %}}
Note that, as you implemented an assembler, you don't use the default
assembler anymore. So remove the `@DtoOf` annotation on the DTO.
{{% /callout %}}

```
public class ProductModelMapperAssembler extends ModelMapperAssembler<Product, ProductRepresentation> {

    @Override
    protected void configureAssembly(ModelMapper modelMapper) {
        modelMapper.addMappings(new PropertyMap<Product, ProductRepresentation>() {
            @Override
            protected void configure() {
                // Required due to the ambiguity with the categoryId field
                map().setId(source.getEntityId());
            }
        });
    }

    @Override
    protected void configureMerge(ModelMapper modelMapper) {
    }
}
```

Then use it as usual.

```
@Inject
private Assembler<Product, ProductRepresentation> assembler;
```

```
assembler.assembleDtoFromAggregate(aProduct);
```

---
