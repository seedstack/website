---
title: "Assemblers"
type: "home"
zones:
    - "Docs"
tags:
    - domain-driven design
    - interfaces
menu:
    docs:
        parent: "business"
        weight: 40
---

{{% callout def %}}
**An assembler is an interface object responsible for mapping one or more aggregate(s) to a Data Transfer Object (DTO) 
and back.**
{{% /callout %}}
<!--more-->

In Domain-Driven Design an interface layer is necessary to avoid coupling your domain to the outside world. A domain object
is never exposed directly to the outside world but is mapped to a Data Transfer Object specifically tailored for the client
needs. The assembler pattern allows to encapsulate this mapping responsibility in a separate object.

## Explicit assembler

### Single aggregate assembler

To declare an assembler with the business framework you have multiple alternatives depending upon the way your want to
map your aggregate and your DTO.

{{% tabs list="Model Mapper|Basic|Interface" %}}
{{% tab "Model Mapper" true %}}
This type of assembler uses [ModelMapper](http://modelmapper.org/). Mapping is handled automatically but you can still 
configure custom mappings, converters, matching strategies, etc. according to [its documentation](http://modelmapper.org/getting-started/). 

To declare a ModelMapper assembler, extend the {{< java "org.seedstack.business.assembler.modelmapper.ModelMapperAssembler" >}} class: 

```java
public class SomeModelMapperAssembler extends ModelMapperAssembler<SomeAggregate, 
                                                                   SomeDTO> {
    @Override
    protected void configureAssembly(ModelMapper modelMapper) {
        // if necessary, configure model mapper for mapping the aggregate to the DTO 
    }

    @Override
    protected void configureMerge(ModelMapper modelMapper) {
        // if necessary, configure model mapper for mapping the DTO to the aggregate 
    }
}
```
{{% /tab %}}
{{% tab "Basic" %}}
In a basic assembler, mapping must be done manually. To declare a basic assembler, extend the {{< java "org.seedstack.business.assembler.BaseAssembler" >}} class:

```java
public class SomeAssembler extends BaseAssembler<SomeAggregate, SomeDTO> {
    @Override
    protected void doAssembleDtoFromAggregate(SomeDTO targetDto, 
                                              SomeAggregate sourceAggregate) {
        // map attributes from sourceAggregate to targetDto
    }
    
    @Override
    protected void doMergeAggregateWithDto(SomeAggregate targetAggregate, 
                                           SomeDTO sourceDto) {
        // map attributes from sourceDto to targetAggregate
    }
}
```

{{% /tab %}}
{{% tab "Interface" %}}
If you need full control over the inheritance of your assembler, you can implement the {{< java "org.seedstack.business.assembler.Assembler" >}} interface:

```java
public class SomeAssembler implements Assembler<SomeAggregate, SomeDTO> {
    @Override
    public SomeDTO assembleDtoFromAggregate(SomeAggregate sourceAggregate) {
        // this method is useful when the DTO doesn't have a default constructor
    }

    @Override
    public void assembleDtoFromAggregate(SomeDTO targetDto, 
                                         SomeAggregate sourceAggregate) {
        // map attributes from sourceAggregate to targetDto
    }

    @Override
    public void mergeAggregateWithDto(SomeAggregate targetAggregate, 
                                      SomeDTO sourceDto) {
        // map attributes from sourceDto to targetAggregate
    }

    @Override
    public Class<SomeDTO> getDtoClass() {
        return SomeDTO.class;
    }
}
```
{{% /tab %}}
{{% /tabs %}}

{{% callout info %}}
An assembler is located in the interface layer and in the same package as the DTO it produces.
{{% /callout %}}

### Multiple aggregates assembler

In business code, you sometimes have to group multiple business objects together. You can do so by writing a custom class
but you can also use a tuple, which is a data structure corresponding to a sequence of immutable objects.
 
The business framework tuple integration is based on the [javatuples.org](http://javatuples.org) library. It provides tuple
classes from one to ten elements:
 
 ```java
 public class SomeClass {
     Unit<A>                     unit;    // 1 element
     Pair<A,B>                   pair;    // 2 elements
     Triplet<A,B,C>              triplet; // 3 elements
     Quartet<A,B,C,D>            quartet; // 4 elements
     Quintet<A,B,C,D,E>          quintet; // 5 elements
     Sextet<A,B,C,D,E,F>         sextet;  // 6 elements
     Septet<A,B,C,D,E,F,G>       septet;  // 7 elements
     Octet<A,B,C,D,E,F,G,H>      octet;   // 8 elements
     Ennead<A,B,C,D,E,F,G,H,I>   ennead;  // 9 elements
     Decade<A,B,C,D,E,F,G,H,I,J> decade;  // 10 elements
 }
 ```

Assemblers support assembling and merging a single DTO with multiple aggregates by using tuples. To do so:

* Extend the tuple variants of assembler classes:
  * {{< java "org.seedstack.business.assembler.modelmapper.ModelMapperTupleAssembler" >}} instead of {{< java "org.seedstack.business.assembler.modelmapper.ModelMapperAssembler" >}}.
  * {{< java "org.seedstack.business.assembler.BaseTupleAssembler" >}} instead of {{< java "org.seedstack.business.assembler.BaseAssembler" >}}.    
* Specify a tuple of aggregates in place of the single aggregate generic parameter.  

### Usage

To use your assembler directly, simply [inject it]({{< ref "docs/basics/dependency-injection.md" >}}) where required: 

```java
public class SomeClass {
    @Inject
    private Assembler<SomeAggregate, SomeDTO> someDTOAssembler;
    
    public void someMethod(SomeAggregate someAggregate) {
        SomeDTO someDTO = someDTOAssembler.assembleDtoFromAggregate(someAggregate);        
    }
}
```

{{% callout info %}}
By default, assemblers are instantiated each time they are injected, avoiding the risk to wrongly keep an internal state 
between uses. In some cases, after having well considered the issue, you can choose to make your assembler a singleton by
annotating the assembler implementation with {{< java "javax.inject.Singleton" "@" >}}.
{{% /callout %}}

## Default assembler

For each type of assembler capable of doing automatic mapping (like Model Mapper), the business framework provides a 
default assembler implementation. All it needs is a {{< java "org.seedstack.business.assembler.DtoOf" "@" >}} annotation
on the DTO class, linking it to the aggregate(s) it represents:

### Usage

```java
@DtoOf(SomeAggregate.class)
public class SomeDTO {
    
}
```

Just inject the qualified {{< java "org.seedstack.business.assembler.Assembler" >}} interface. In the case of Model Mapper,
use the {{< java "org.seedstack.business.assembler.ModelMapper" "@" >}} qualifier:

```java
public class SomeClass {
    @Inject
    @ModelMapper
    private Assembler<SomeAggregate, SomeDTO> someDTOAssembler;
    
    public void someMethod() {
        SomeDTO someDTO = someDTOAssembler.assembleDtoFromAggregate(someAggregate);        
    }
}
```

{{% callout tips %}}
If the DTO is mapped to multiple aggregates, list them all in the annotation. The assembler should then be injected with
the corresponding tuple (`Pair`, `Triplet`, ...) of aggregates in place of the single aggregate generic parameter.  
{{% /callout %}}

{{% callout info %}}
Other default assembler implementations may be available as [add-ons]({{< baseUrl >}}addons).
{{% /callout %}}

## Fluent assembler DSL

To facilitate the usage of assemblers, a fluent Domain-Specific Language (DSL) is provided. This DSL is a facade for all
assemblers, having the ability to select the correct assembler and apply it in various workflows. To use it, inject the 
{{< java "org.seedstack.business.assembler.FluentAssembler" >}} interface:
  
```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
}
```

{{% callout info %}}
The fluent assembler delegates the assembling and the merging task to the assembler it selects. The assembling/merging
behavior must still be implemented in an assembler (or a default assembler implementation can be used).
{{% /callout %}}

### Working with single objects

Fluent assembler can assemble or merge single objects:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void assemble(Person person) {
        PersonDTO personDTO = fluentAssembler
                                  .assemble(person)
                                  .to(PersonDTO.class);
    }
    
    public void merge(PersonDTO personDTO, Person person) {
        fluentAssembler
            .merge(personDTO)
            .into(person);
    }
}
```

### Working with lists

Fluent assembler can assemble or merge lists of objects:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void assembleList(List<Person> personList) {
        List<PersonDTO> personDTOList = fluentAssembler
                                            .assemble(personList)
                                            .to(PersonDTO.class);
    }
    
    public void mergeList(List<PersonDTO> personDTOList, List<Person> personList) {
        fluentAssembler
            .merge(personDTOList)
            .into(personList);
    }
}
```

### Qualifying the assembler implementation

If a qualified assembler implementation is required, like in the case of a default assembler, specify the qualifier class using
the `with()` method:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void assembleList(List<Person> personList) {
        List<PersonDTO> personDTOList = fluentAssembler
                                            .assemble(personList)
                                            .with(ModelMapper.class)
                                            .to(PersonDTO.class);
    }
    
    public void mergeList(List<PersonDTO> personDTOList, List<Person> personList) {
        fluentAssembler
            .merge(personDTOList)
            .with(ModelMapper.class)
            .into(personList);
    }
}
```

### Automatically creating aggregates

When merging DTO to aggregates, fluent assembler DSL can use a factory to automatically create aggregates as necessary:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void merge(PersonDTO personDTO) {
        fluentAssembler
            .merge(personDTO)
            .into(Person.class)
            .fromFactory();
    }
    
    public void mergeList(List<PersonDTO> personDTOList) {
        fluentAssembler
            .merge(personDTOList)
            .into(Person.class)
            .fromFactory();
    }
}
```

To find a matching factory method for the aggregate, the {{< java "org.seedstack.business.assembler.MatchingFactoryParameter" "@" >}}
must be used on DTO getter(s), specifying the position of the factory method parameter it corresponds to:

```java
public class PersonDTO {
    private String firstName;
    private String lastName;
    
    @MatchingFactoryParameter(index = 0)
    public String getFirstName() {
        return firstName;
    }
    
    @MatchingFactoryParameter(index = 1)
    public String getLastName() {
        return lastName;
    }
}
```

These annotations will make fluent assembler DSL find a method on the factory corresponding to the following signature:
 
```java
public interface PersonFactory extends GenericFactory<Person> {
    
    Person createPersonFromName(String firstName, String lastName);
    
}
```

{{% callout warning %}}
If multiple methods on the factory match the parameters derived from the {{< java "org.seedstack.business.assembler.MatchingFactoryParameter" "@" >}}
annotations, an exception will be thrown.
{{% /callout %}}

### Automatically retrieving aggregates from persistence

When merging DTO to aggregates, fluent assembler DSL can use a repository to automatically retrieve aggregates from persistence
as necessary:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void merge(PersonDTO personDTO) {
        fluentAssembler
            .merge(personDTO)
            .into(Person.class)
            .fromRepository()
            .orFail();
    }
    
    public void mergeList(List<PersonDTO> personDTOList) {
        fluentAssembler
            .merge(personDTOList)
            .into(Person.class)
            .fromRepository()
            .orFail();
    }
}
```

{{% callout info %}}
The `orFail()` method indicates that an {{< java "org.seedstack.business.assembler.dsl.AggregateNotFoundException" >}}
will be thrown if the aggregate is not found in the repository.
{{% /callout %}}

To retrieve the aggregate from its repository, the {{< java "org.seedstack.business.assembler.MatchingEntityId" "@" >}}
annotation must be used on the DTO getter providing the aggregate identifier:

```java
public class PersonDTO {
    private String id;
    private String firstName;
    private String lastName;
    
    @MatchingEntityId
    public String getId() {
        return id;
    }
}
```

This annotation will use the value return by the `getId()` method to retrieve the aggregate from its repository. 

{{% callout tips %}}
If the identifier is a value object you can use the annotation on multiple getters and specify an index to match a constructor of the
value object, similarly to what is done for [factory methods](#automatically-creating-aggregates). 
{{% /callout %}}

### Combining creating and retrieving aggregates

When merging DTO to aggregates, fluent assembler DSL can combine repository retrieval with creation by the factory:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void merge(PersonDTO personDTO) {
        fluentAssembler
            .merge(personDTO)
            .into(Person.class)
            .fromRepository()
            .orFromFactory();
    }
    
    public void mergeList(List<PersonDTO> personDTOList) {
        fluentAssembler
            .merge(personDTOList)
            .into(Person.class)
            .fromRepository()
            .orFromFactory();
    }
}
```

If the aggregate is not found in the repository, it is created with the factory. Both {{< java "org.seedstack.business.assembler.MatchingEntityId" "@" >}}
and {{< java "org.seedstack.business.assembler.MatchingFactoryParameter" "@" >}} annotations must be present on the relevant DTO
getters.

{{% callout tips %}}
When working with lists, fluent assembler allows to mix aggregates retrieved from the repository with ones created 
by the factory. You can force aggregates from a list to come from a single source (either the repository or the factory)
by using `orFromFactory(false)`.    
{{% /callout %}}

## Example

This example shows a customized ModelMapper assembler used through the fluent assembler facade to map a `Product` to
a `ProductRepresentation` and back. The aggregate uses a [value object]({{< ref "docs/business/value-objects.md" >}})
as identifier. 

### The identifier value object

```java
public class ProductReference extends BaseValueObject {
    private int storeId;
    private int productCode;
    
    public ProductReference(int storeId, int productCode) {
        this.storeId = storeId;
        this.productCode = productCode;
    }
    
    public int storeId() {
        return storeId;
    }
    
    public int productCode() {
        return productCode;
    }
}
```

### The aggregate

```java
public class Product extends BaseAggregateRoot<ProductReference> {
    private ProductReference reference;
    private String name;
    private String description;

    Product(ProductReference reference, String name) {
        this.reference = reference;
        this.name = name;
    }
    
    public ProductReference getReference() {
        return reference;
    }
    
    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void changeDescription(String description) {
        this.description = description;
    }

    @Override
    public ProductReference getId() {
        return reference;
    }
}
```

### The factory

```java
public interface ProductFactory extends GenericFactory<Product> {
	Product createProduct(int storeId, int productCode, String name);
}
```

The implementation is omitted for brevity.
 
### The DTO 
 
```java
public class ProductRepresentation {
    private int storeId;
    private int productCode;
    private String name;
    private String description;

    @MatchingEntityId(index = 0)
    @MatchingFactoryParameter(index = 0)
    public int getStoreId() { 
        return storeId;
    }

    public void setStoreId(int storeId) {
        this.storeId = storeId;
    }

    @MatchingEntityId(index = 1)
    @MatchingFactoryParameter(index = 1)
    public int getProductCode() {
        return productCode;
    }
    
    public void setProductCode(int productCode) {
        this.productCode = productCode;
    }

    @MatchingFactoryParameter(index = 2)
    public String getName() { 
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() { 
        return description; 
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}
```

### The assembler

```java
public class ProductMapperAssembler extends ModelMapperAssembler<Product, 
                                                                 ProductRepresentation> {
    @Override
    protected void configureAssembly(ModelMapper modelMapper) {
        modelMapper.addMappings(new PropertyMap<Product, ProductRepresentation>() {
            @Override
            protected void configure() {
                map().setStoreId(source.getReference().getStoreId());
                map().setProductCode(source.getReference().getProductCode());
            }
        });        
    }

    @Override
    protected void configureMerge(ModelMapper modelMapper) {
        modelMapper.addMappings(new PropertyMap<ProductRepresentation, Product>() {
            @Override
            protected void configure() {
                map().changeDescription(source.getDescription());
            }
        });
    }
}
```

### Using FluentAssembler

Mapping a `Product` to a `ProductRepresentation` and back:
 
```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    @Inject
    private ProductFactory productFactory;
    
    public void someMethod() {
        Product product = productFactory.createProduct(1, 1, "Product #1");
        product.changeDescription("Some description");
        
        ProductRepresentation productRepresentation = fluentAssembler
            .assemble(product)
            .to(ProductRepresentation.class);
        
        productRepresentation.setDescription("Changed description");

        fluentAssembler
            .merge(productRepresentation)
            .into(product);
    }
}
``` 
