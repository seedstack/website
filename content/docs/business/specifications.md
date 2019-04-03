---
title: "Specifications"
type: "home"
zones:
    - "Docs"
sections:
    - "Manual"    
tags:
    - domain-driven design
menu:
    docs-manual:
        parent: "business"
        weight: 13
---

{{% callout def %}}
**A specification encapsulates a business criteria and is able to tell if a candidate object matches this criteria.**  
{{% /callout %}}
<!--more-->

## Characteristics

### Parameterized

A specification can define attributes for values that commonly vary. This allows to reuse a specification in various
situations. 

### Composite

Multiple specifications can be combined together with "and", "or" and "not" operators to form more complex specifications.
This characteristic allows for great flexibility in the specification definition, without requiring many specialized classes.  

## Declaration

The business framework provides a {{< java "org.seedstack.business.specification.Specification" >}} interface that all
specification classes must implement. This interface directly provides an implementation for:
 
* The `any()` static method to create a specification that is satisfied by any candidate object,
* The `none()` static method to create a specification that is satisfied by no candidate object,
* The `and()`, `or()` and `negate()` methods for composing it with other specifications,
* The `asPredicate()` method to convert the specification to a Java predicate.

To create a specification, simply implement the {{< java "org.seedstack.business.specification.Specification" >}} interface
and implement the `isSatisfiedBy()` method:

```java
public class SomeSpecification implements Specification<SomeClass> {
    private final int someValue;
    
    public SomeSpecification(int someValue) {
        this.someValue = someValue;
    }    
    
    public boolean isSatisfiedBy(SomeClass candidate) {
        // return true if the candidate satisfies the specification
        // or false otherwise
    }
}
```  

## Usage

In the business framework, specifications are simple objects that are created through their constructors. You can then
use the `isSatisfiedBy()` method directly:

```java
public class SomeClass {
    public void someMethod(SomeClass candidate) {
        SomeSpecification someSpecification = new SomeSpecification(45);
        if (someSpecification.isSatisfiedBy(candidate)) {
            // do something
        }
    }
}
```

{{% callout info %}}
As unmanaged objects, specifications do not benefit from dependency injection nor interception. Dependencies, if any,
must be passed explicitly.
{{% /callout %}}

### For querying

When you need to select a subset of aggregates based on some criteria, a specification can express this criteria on the 
domain model. It can then be used directly by a [repository]({{< ref "docs/business/repositories.md" >}})
to efficiently retrieve a {{< java "java.util.stream.Stream" >}} of aggregates matching this specification.

### For validation

When you need to check that only suitable objects are used for a certain purpose, a specification can express this 
suitability criteria.

### For construction-to-order

When you need to describe what an object might do, without explaining the details of how the object does it, but in such 
a way that a candidate might be built to fulfill the requirement, a specification can express this requirement.

## Built-in specifications

The business framework provides several simple specifications that can be composed to express a more complex one. One of
the most useful is the {{< java "org.seedstack.business.specification.AttributeSpecification" >}} which allows to
apply another specification to an object attribute.

Consider the following example:

```java
public class SomeClass {
    public void someMethod() {
        Specification<Team> redTeamSpecification = new AttributeSpecification<>(
            "name", 
            new EqualSpecification<>("RED")
        );
    }
}
```

This creates a specification that can be used to test if a candidate `Team` object has its attribute `name` equal to `RED`.

## Specification builder

The business framework provides an injectable {{< java "org.seedstack.business.specification.dsl.SpecificationBuilder" >}} 
that exposes a Domain-Specific Language (DSL) for creating complex specifications by composition: 

```java
public class SomeClass {
    @Inject
    private SpecificationBuilder specificationBuilder;
    
    public void someMethod(Team candidate) {
        Specification<Team> spec = specificationBuilder.of(Team.class)
                .property("leader.name").not().equalTo("Alice")
                .or()
                .property("leader.name").not().equalTo("Roger")
                .or()
                .property("leader.age").lessThan(15).and()
                .property("leader.address.number").not().equalTo(5).and()
                .property("leader.address.city").equalTo("SomeCity")
                .build();
    }
}
```

{{% callout info %}}
The specification builder rely on expressing the boolean predicates in the **[disjunctive normal form (DNF)](https://en.wikipedia.org/wiki/Disjunctive_normal_form)**. 
A specification in DNF is a disjunction (OR) of conjunctive clauses (AND). In other words it requires that the predicates 
are expressed as an OR clause of AND clauses.
{{% /callout %}}

{{% callout tips %}}
The specification builder offers various additional features. Please check the Javadoc for more details.  
{{% /callout %}}

