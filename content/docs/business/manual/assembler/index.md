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

The assembler pattern is used to transfer a representation of the state of *Aggregates* to *DTO/Representation* objects. 
The Business Framework provides a interface and few base classes to ease the development of assemblers.

# Usage

## Default assembler

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

## Explicit assembler

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

{{% callout info %}}
**Reduce the boilerplate**. You want to use lists and update aggregate from the repository ? 
Read the page on the [assembler DSL](/docs/business/manual/assembler/fluent-assembler/).
{{% /callout %}}
