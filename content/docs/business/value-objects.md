---
title: "Value Objects"
type: "home"
zones:
    - "Docs"
sections:
    - "Manual"    
tags:
    - domain-driven design
aliases: /docs/business/manual/value-objects    
menu:
    docs-manual:
        parent: "business"
        weight: 11
---

{{% callout def %}}
**A value object is used to describe or compute some characteristic of a domain concept.<br>
It does not have an identity.**
{{% /callout %}}
<!--more-->

## Characteristics

A value object measures, quantifies or describes something in the domain. A value object has no lifecycle from the domain
perspective. As such we don't need to provide him an identity. Value objects can be created and destroyed at will without
any impact.

### Immutability

A value object is immutable, meaning that its state cannot be changed after creation. If you need to change a value object, 
create a new one derived from the initial one. Value object immutability means that they can be easily shared across the
whole system.

### Conceptual whole

A value object describes a conceptual whole. All of its attributes are related to each other and are all participating 
to the description of the thing.

### Behavior

As [entities]({{< ref "docs/business/entities.md" >}}), value objects should contain behavior that is relevant to
them. If the domain concept described by the value object has a behavior, write methods encapsulating it. This behavior must 
remain side-effect free (not depending upon any mutable state).

## Declaration

To declare a value object with the business framework, you have two alternatives. 

{{% tabs list="Base class|Interface" %}}
{{% tab "Base class" true %}}
Extend the {{< java "org.seedstack.business.domain.BaseValueObject" >}} class:

```java
public class SomeValueObject extends BaseValueObject {
    private String attribute1;
    private String attribute2;

    public SomeValueObject(String attribute1, String attribute2) {
        this.attribute1 = attribute1;
        this.attribute2 = attribute2;
    }

    // Other methods
}
```

By extending {{< java "org.seedstack.business.domain.BaseValueObject" >}}, you will have a default implementation of the
`equals()` and `hashCode()` methods, consistent with the definition of a value object. A `toString()` is also provided by default.
{{% /tab %}}
{{% tab "Interface" %}}
Implement the {{< java "org.seedstack.business.domain.ValueObject" >}} interface:

```java
public class SomeValueObject implements ValueObject {
    private String attribute1;
    private String attribute2;

    public SomeValueObject(String attribute1, String attribute2) {
        this.attribute1 = attribute1;
        this.attribute2 = attribute2;
    }
    
    public int hashCode() {
        // TODO: implement based on all attributes
    }

    public boolean equals() {
        // TODO: implement based on all attributes
    }

    // Other methods
}
```

Implementing {{< java "org.seedstack.business.domain.ValueObject" >}} allows you to fully control the inheritance of your
value object. However, you will have to implement `equals()` and `hashCode()` methods yourself, consistently with the definition 
of a value object (i.e. based on all the value object attributes). 
{{% /tab %}}
{{% /tabs %}}

## Usage as identifiers

Value object characteristics make them well-suited to be used as identifiers for entities. They are ideal for composite
identifiers but even for simple identifiers they provide immutability, type safety and encapsulation. Consider the example
below:

```java
public class CustomerId extends BaseValueObject {
    private final CustomerType type;
    private final String id;

    public CustomerId(String customerId) {
        if (customerId.length() != 7) {
            throw new IllegalArgumentException("Invalid customer id: " + customerId);
        }
        this.type = CustomerType.valueOf(customerId.substring(0, 1));
        this.id = customerId.substring(1);
    }
    
    public CustomerType customerType() {
        return type;        
    }
    
    public String id() {
        return id;
    }
}
```

## Example

### A postal address

```java
public class Address extends BaseValueObject {
    private final int number;
    private final String street;
    private final String city;
    private final ZipCode zipCode;

    public Address(
            int number,
            String street,
            String city,
            ZipCode zipCode) {
        this.number = number;
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
    }
    
    public int number() {
        return number;
    }
    
    public String street(); {
        return street;
    }
    
    public String city() {
        return city;
    }

    public ZipCode zipCode() {
        return zipCode;
    }
    
    @Override
    public String toString(){
        return String.format("%d %s\n%s %s", number, street, zipCode, city.toUpperCase());
    }
}
```

### A ZipCode

The zip code value object could start as simple as this:

```java
public class ZipCode extends BaseValueObject {
    private final String value;

    public ZipCode(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
```

{{% callout tips %}}
Even for trivial implementations like the `ZipCode` class above, defining a value object will give you:

* Immutability
* Type safety
* Hiding of implementation
* An ideal and unique place for extensions, formatting and validations
* The ability to refactor
{{% /callout %}}
