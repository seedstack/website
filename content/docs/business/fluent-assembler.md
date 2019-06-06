---
title: "Fluent assembler"
type: "home"
zones:
    - "Docs"
sections:
    - "Business"    
tags:
    - domain-driven design
    - interfaces
menu:
    docs-business:
        parent: "interfaces"
        weight: 41
---

As described in the [assemblers page]({{< ref "docs/business/assemblers.md" >}}), you can inject assemblers and use them
directly. However, the business framework provides a Domain-Specific Language (DSL) to do common Aggregate/DTO mapping 
operations.<!--more-->

To use it, inject the {{< java "org.seedstack.business.assembler.dsl.FluentAssembler" >}} interface:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
}
```
 
{{% callout info %}}
The fluent assembler automatically uses the proper assembler to do its work. 
**The mapping behavior must still be implemented by a default or a custom assembler.**
{{% /callout %}}

## Usage

Fluent assembler can assemble from an aggregate to a DTO:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void someMethod(Person person) {
        PersonDto personDto = fluentAssembler
                                  .assemble(person)
                                  .to(PersonDto.class);
    }
}
```

Or it can merge a DTO back into an aggregate:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void someMethod(PersonDto personDto, Person person) {
        fluentAssembler
            .merge(personDto)
            .into(person);
    }
}
```

### Automatic aggregate creation

When merging DTO to aggregates, fluent assembler DSL can use a factory to automatically create aggregates as necessary:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void someMethod(PersonDto personDto) {
        fluentAssembler
            .merge(personDto)
            .into(Person.class)
            .fromFactory();
    }
}
```

To find a matching factory method for the aggregate, the {{< java "org.seedstack.business.assembler.FactoryArgument" "@" >}}
must be used on DTO getter(s), specifying the position of the factory method parameter it corresponds to:

```java
public class PersonDto {
    private String firstName;
    private String lastName;
    
    @FactoryArgument(index = 0)
    public String getFirstName() {
        return firstName;
    }
    
    @FactoryArgument(index = 1)
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
If multiple methods on the factory match the parameters derived from the {{< java "org.seedstack.business.assembler.FactoryArgument" "@" >}}
annotations, an exception will be thrown.
{{% /callout %}}

### Automatic aggregate retrieval

When merging DTO to aggregates, fluent assembler DSL can use a repository to automatically retrieve aggregates from persistence
as necessary:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void someMethod(PersonDto personDto) {
        fluentAssembler
            .merge(personDto)
            .into(Person.class)
            .fromRepository()
            .orFail();
    }
}
```

{{% callout info %}}
The `orFail()` method indicates that an {{< java "org.seedstack.business.domain.AggregateNotFoundException" >}}
will be thrown if the aggregate is not found in the repository.
{{% /callout %}}

To retrieve the aggregate from its repository, the {{< java "org.seedstack.business.assembler.AggregateId" "@" >}}
annotation must be used on the DTO getter providing the aggregate identifier:

```java
public class PersonDto {
    private String id;
    private String firstName;
    private String lastName;
    
    @AggregateId
    public String getId() {
        return id;
    }
}
```

This annotation will use the value return by the `getId()` method to retrieve the aggregate from its repository. 

{{% callout tips %}}
If the identifier is a complex value object created from multiple fields, you can add a method to the DTO for creating 
the value-object. The {{< java "org.seedstack.business.assembler.AggregateId" "@" >}} annotation will then be put 
on that method.
{{% /callout %}}

### Combination of automatic retrieval and creation

When merging DTO to aggregates, fluent assembler DSL can combine repository retrieval with creation by the factory:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void someMethod(PersonDto personDto) {
        fluentAssembler
            .merge(personDto)
            .into(Person.class)
            .fromRepository()
            .orFromFactory();
    }
}
```

If the aggregate is not found in the repository, it is created with the factory. Both {{< java "org.seedstack.business.assembler.AggregateId" "@" >}}
and {{< java "org.seedstack.business.assembler.FactoryArgument" "@" >}} annotations must be present on the relevant DTO
getters.

## Working with multiple objects

All the operations described above also work on multiple objects at once. 

Assembling or merging from the following types is supported:

* An array,
* A {{< java "java.util.stream.Stream" >}},
* A {{< java "java.util.List" >}},
* A {{< java "java.util.Set" >}},
* An arbitrary {{< java "java.util.Collection" >}},
* A {{< java "org.seedstack.business.pagination.Slice" >}} (for offset-based and key-based pagination),
* A {{< java "org.seedstack.business.pagination.Page" >}} (for page-based pagination).

The following example is for assembling from an array of aggregates to a stream of DTO:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void someMethod(Person... persons) {
        Stream<PersonDto> personDtoStream = fluentAssembler
                                            .assemble(persons)
                                            .toStreamOf(PersonDto.class);
    }
}
```

The following example is for merging a list of DTO into a stream of aggregates created from the factory:

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void someMethod(List<PersonDto> personDtoList) {
        Stream<Person> personStream = fluentAssembler
                                        .merge(personDtoList)
                                        .into(Person.class)
                                        .fromFactory()
                                        .asStream();
    }
}
```

{{% callout tips %}}
By assembling or merging from {{< java "java.util.stream.Stream" >}} to {{< java "java.util.stream.Stream" >}}, you can
process infinite amount of objects without consuming much memory. This can be very effective when combined with repository
methods returning a {{< java "java.util.stream.Stream" >}}.
{{% /callout %}}

## Specifying an assembler qualifier

If a qualified assembler implementation is required, specify the qualifier class using the `with()` method.

The following example uses a ModelMapper default assembler: 

```java
public class SomeClass {
    @Inject
    private FluentAssembler fluentAssembler;
    
    public void someMethod(Person person) {
        PersonDto personDto = fluentAssembler
                                  .assemble(person)
                                  .with(ModelMapper.class)
                                  .to(PersonDto.class);
    }
}
```

## Example

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
