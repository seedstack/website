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

---

{{% callout info %}}
**Reduce the boilerplate**

- You don't require complex mapping ? Read the next page on
[Default assemblers](/docs/business/manual/assembler/modelmapper/)
- You want to use lists and update aggregate from the repository ?
Read the page on the [assembler DSL](/docs/business/manual/assembler/fluent-assembler/)
{{% /callout %}}
