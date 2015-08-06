---
title: "ModelMapper assemblers"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessAssembler"
menu:
    BusinessAssembler:
        weight: 20
---

DTOs are meant to expose domain objects or a part of these objects.
So there are often similarities between the DTOs and the domain
object.
This can lead to a lot of boilerplate code when the assembler doesn't
hold complex logic but just populates objects.

For this use case, you can now **use a default** assembler based on
[ModelMapper](http://modelmapper.org/). It's an *automatic assembler*
which provides an **intelligent mapping**.

# How to use it ?

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

# How it works ?

It uses a intelligent mapping provided by the ModelMapper library.
You can find the detailed explanation here
[matching documentation](http://modelmapper.org/user-manual/how-it-works/).

# Can I customize it ?

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

## Can I see some code ?

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

{{% callout info %}}
**Go further using the DSL**

You want to use lists and update aggregate from the repository ?
Read the page on the [assembler DSL](/docs/business/manual/assembler/fluent-assembler/).
{{% /callout %}}
