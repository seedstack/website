---
title: "Assemblers"
type: "home"
zones:
    - "Docs"
tags:
    - domain-driven design
    - interfaces
aliases: /docs/business/manual/assemblers    
menu:
    docs:
        parent: "business"
        weight: 40
        pre: "<h6>Interfaces</h6>"
---

{{% callout def %}}
**An assembler is an interface object responsible for mapping one or more aggregate(s) to a Data Transfer Object (DTO) 
and back.**
{{% /callout %}}
<!--more-->

In Domain-Driven Design an interface layer is necessary to avoid coupling your domain to the outside world. A domain object
is never exposed directly to the outside world but is mapped to a Data Transfer Object specifically tailored for the client
needs. The assembler pattern allows to encapsulate this mapping responsibility in a separate object.

## Default assembler

{{% callout info %}}
Default assemblers are only available when you have at least one add-on providing a default assembler implementation, such
as the ModelMapper add-on.
{{% /callout %}}

To have the business framework generate a default assembler, annotate your DTO class with {{< java "org.seedstack.business.assembler.DtoOf" "@" >}}:

```java
@DtoOf(SomeAggregate.class)
public class SomeDto {
    
}
```

Then you can use a qualified injection of the parameterized {{< java "org.seedstack.business.assembler.Assembler" >}} interface.
For ModelMapper, this would be:

```java
public class SomeClass {
    @Inject
    private Assembler<SomeAggregate, SomeDto> someDtoAssembler;
    
    public void someMethod(SomeAggregate someAggregate) {
        SomeDto someDto = someDtoAssembler.createDtoFromAggregate(someAggregate);
    }
}
``` 

{{% callout tips %}}
The example above maps the objects using default settings. See the ModelMapper add-on docs to learn about other possibilities.
{{% /callout %}}

## Custom assembler

Sometimes it makes more sense to write your own custom assembler. 

### Declaration

To declare a custom assembler you have two alternatives:

{{% tabs list="Base class|Interface" %}}
{{% tab "Base class" true %}}
Extend the {{< java "org.seedstack.business.assembler.BaseAssembler" >}} class:

```java
public class SomeAssembler extends BaseAssembler<SomeAggregate, SomeDto> {
    @Override
    public void mergeAggregateIntoDto(A sourceAggregate, D targetDto) {
        // aggregate to dto mapping logic
    }

    @Override
    public void mergeDtoIntoAggregate(D sourceDto, A targetAggregate) {
        // dto to aggregate mapping logic
    }
}
```

{{% /tab %}}
{{% tab "Interface" %}}
Implement the {{< java "org.seedstack.business.assembler.Assembler" >}} interface:

```java
public class SomeAssembler implements Assembler<SomeAggregate, SomeDto> {
    @Override
    public void mergeAggregateIntoDto(A sourceAggregate, D targetDto) {
        // aggregate to dto mapping logic
    }

    @Override
    public void mergeDtoIntoAggregate(D sourceDto, A targetAggregate) {
        // dto to aggregate mapping logic
    }

    @Override
    public Class<SomeDto> getDtoClass() {
        return SomeDto.class;
    }
}
```
{{% /tab %}}
{{% /tabs %}}

### Usage

To use your assembler directly, [inject]({{< ref "docs/basics/dependency-injection.md" >}}) the 
{{< java "org.seedstack.business.assembler.Assembler" >}} interface: 

```java
public class SomeClass {
    @Inject
    private Assembler<SomeAggregate, SomeDto> someDtoAssembler;
    
    public void someMethod(SomeAggregate someAggregate) {
        SomeDto someDto = someDtoAssembler.createDtoFromAggregate(someAggregate);
    }
}
```

{{% callout tips %}}
Read-on about [fluent assembler DSL]({{< ref "docs/business/fluent-assembler.md" >}}), which can automate
advanced mapping operations with a one-liner.
{{% /callout %}}

