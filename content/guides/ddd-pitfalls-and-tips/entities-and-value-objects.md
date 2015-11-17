---
title: "Entities and Value Objects"
guide: "DDD pitfalls and tips"
author: "SeedStack"
menu:
    DDDPitfallsAndTipsGuide:
        weight: 30
---

Modeling business concepts with objects may seem very intuitive at first sight but there are a lot of difficulties 
awaiting us in the details. To clarify the meaning of model elements and propose a set of design practices, Domain-Driven
Design defines three patterns that express the model: Entities, Value Objects and Services. This chapter will focus
on Entities and Value Objects, leaving Services for their [own chapter](../behavior-and-services).

# Entities
    
An object having a specific identity and defined primarily by it is called an Entity. We model a domain concept as an
Entity when its individuality is primordial and it must be distinguished from other objects in the system. There is a
notion of continuity in Entities, as they can change drastically throughout their lifecycle, yet they remain uniquely 
identified.

Entities don't need to be tied to an identifiable real-world concept, as their name could imply. They can be anything
that need to be tracked in the system, regardless of their attributes.

## Identity

When designing an Entity, the focus should be put first on its primary attributes and behaviors that contribute to
its identity. There is a tendency, especially for DDD beginners, to focus on data and define all the attributes
of a domain object. This should be delayed until all the aspects of the Entity identity have been considered and
settled. One should first consider how the identity is obtained.

### User-provided identity

The user could input one or more unique values into the application to be used as an identity, which in turn should 
ensure that they have the required qualities:

* Correctness. The provided values should adequately identify the Entity without ambiguity.
* Uniqueness. The provided values should be unique among all the entities of the same type.
* Immutable. Most of the time the identity must be immutable because the cost of changing an identity may be very high.

### Application-generated identity

The application could internally generate an identity using an algorithm that provide unique values. The Business
framework provides an API that can delegate the identity generation to any specified implementation at Entity creation.
This is called **early identity generation** because identity is assigned *before* the Entity can be used in the 
application. This requires the Entity identity attribute to be annotated with `@Identity`: 

    public class MyEntity extends BaseEntity<Long> {
    
        @Identity(handler = SequenceHandler.class)
        private Long id;
        
        // ... other attributes and methods
        
    }

The factory method which create the entity must be annotated with `@Create`:    

    @Create
    MyEntity createMyEntity() {
        return new MyEntity();
    }

Here, the specified handler class (`SequenceHandler`) is an interface so configuration is required to specify the qualifier
of the implementation (it could be `oracle-sequence` for instance) and the additional implementation properties (like a
sequence name). For more information, refer to the [documentation](/docs/business/manual/factory/identity/). 

{{% callout info %}}
This mechanism can be used to delegate the identity generation to a specific technology without tainting your domain (by
keeping the handler implementation in the infrastructure). But it also can be used to simply reuse a pure domain generation
logic across multiple Entity types.
{{% /callout %}}


### Persistence-generated identity

The application waits until a persistence mechanism affects an identity to the persisted Entity. This is called **late
identity generation** and is **less than ideal** because an Entity won't have any identity and, as such, will be invalid 
until it is persisted. It is strongly recommended to use the business framework identity generation mechanism instead, 
which can delegate the generation to the persistence without compromising entity validity.

### Externally-generated identity

Another {{< term "Bounded Context" >}} (like another application) has already an identity or a list of identities which 
the user can choose from. This is the most complex identity creation strategy as it involves one or more external systems.
The Business framework identity generation mechanism can help by allowing to encapsulate this complex logic into a custom 
`IdentityHandler`.

### Surrogate identity

It is sometimes necessary to define a surrogate identity, mainly for certain persistence mechanisms that do not deal
with complex identities. In this case, we need to use two identities: one for the persistence tool which should be hidden
from the rest of the domain and one for the domain which is used throughout the system. The surrogate identity can often
be hidden by using a `private` or `protected` visibility as most persistence tools are able to deal with it.

{{% callout warn %}}
A surrogate identity is not something desirable and should only be used in last resort.
{{% /callout %}}

## Equality

Entity equality should **always** be based on the comparison of the type and the identity only. The Business framework 
`BaseEntity` base class already implements this equality mechanism. If you choose to implement the `Entity` interface 
directly or just annotate you class with `DomainEntity` instead, be sure to implement compliant `equals()` and `hashCode()` 
methods.

# Value Objects

An object that don't have a conceptual identity but is just describing some characteristics of a thing is called a
Value Object. Because the most visible objects in a model are usually Entities, there is a natural tendency to assign 
an identity to every domain object. But this tendency should be refrained. Here are the main characteristics of a 
Value Object:

* It measures, quantifies or describes a thing in the domain.
* It is immutable, meaning that its state cannot be changed after creation.
* It describes a conceptual whole. Its attributes are related to each other and are all participating to the description.
This means that all the required values should be assigned upon creation (i.e. in the constructor).
* It is comparable to others using value equality.
* Its behavior is side-effect free.

## Example

As an example, consider the following class:

    public class MonetaryValue {
        private final BigDecimal amount;
        private final String currency;
        
        public MonetaryValue(BigDecimal amount, String currency) {
            this.amount = amount;
            this.currency = currency;
        }
        
        // ... behavior methods         
    }
    
A monetary value consists at least in an amount of money and the currency this amount is expressed in. These two 
attributes cannot be separated without losing the meaning of this domain object. Moreover, if a thing would be worth 
1000$, we would *not* expect it to have these two separate attributes, as it would muddle the model and its client would
have to know when and how to use `amount` and `currency` together. It would be vastly better to describe the worth as
a whole and only have an attribute of type `MonetaryValue`, especially if it can provide additional behavior to manipulate
it.

## Immutability

One of the most important constraint of a Value Object is immutability. The object state cannot change after it has been
created. When a change is required a new instance of the Value Object is created, either from scratch or derived from 
an existing instance. In this latter case, the object itself can provide methods to derive itself:
 
    public MonetaryValue add(MonetaryValue other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Cannot add two monetary values of different currency");
        }
        
        return new MonetaryValue(amount.add(other.amount), currency);
    }


This method is said to be side-effect-free as it produces an output but without modifying its own state. This kind of
design allows to share any Value Object by reference throughout the system, improving performance without compromising 
model integrity. 

## Simple value as Value Object 

Very often, we resort to primitive data types and Strings to describe a lot of the model attributes. This is sound when
these attributes are secondary to the model. But when considering attributes of first importance, they are better modeled
as Value Objects with only one attribute. For instance an email could be modeled as a String but it would be able to 
provide a real meaning to it nor any behavior. Moreover, it would leak a vague concept in the model client code instead 
of a clear, valid and useful one.

{{% callout info %}}
Since identities are of crucial importance in the model, they can be modeled as Value Objects with great success.
{{% /callout %}}

## Equality

Value Object equality should **always** be based on the comparison of the type and the attributes values. The Business
framework `BaseValueObject` already implement this equality mechanism. If you choose to implement the `ValueObject` 
interface directly or just annotate you class with `DomainValueObject` instead, be sure to implement compliant 
`equals()` and `hashCode()` methods.

## Persistence

Persisting Value Objects as part of referencing Entities can pose its challenges, especially with relational databases
and ORM.

### Simple references

When an entity holds a reference to a Value Object, there is basically two choices:
 
* The Value Object can be serialized in a format such as JSON or XML to a column of the Entity table. The inability to 
execute queries referring to the contents of the Value Object can pose problem though.
* The Value Object attributes can be stored independently as columns of the holding Entity table by using a mechanism
such as JPA `@Embeddable/@Embedded`. This is the preferred way because it preserves the ability to query the Value Object
attributes.

In this case, whatever the method, the persistence of Value Objects is clean and optimized. No persistence store specifics
leaks in the model.

### Collections

Persisting a collection of Value Objects hold by an Entity is more difficult. Like in the single Value Object case, the
whole collection can still be serialized in a specific column although column-size problems can arise in addition to the
inability to query the collection contents. This mechanism may also require custom ORM code to handle the 
serialization/deserialization process.
  
An alternative would to treat such Value Objects as Entities in the data model, by giving them an identity and their own
table. It would be crucial to hide this persistence-only identity from the rest of the domain and the system by using
visibility restrictions (private attribute) or other techniques. 