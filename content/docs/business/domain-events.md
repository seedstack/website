---
title: "Domain events"
type: "home"
zones:
    - "Docs"
sections:
    - "Manual"    
tags:
    - domain-driven design
aliases: /docs/business/manual/events    
menu:
    docs-manual:
        parent: "business"
        weight: 32
---

{{% callout def %}}
**A domain event is used to represent something that happened in the domain.<br>
It happened in the past and is of interest to the business.**
{{% /callout %}}
<!--more-->

## Characteristics

### Past-tense

A domain event always represent something that happened in the past. Its name must be in the past tense and be based upon
the ubiquitous language.

### Contents

A domain event can be as little as just a name. More often, it will contain values and identifiers that represent the 
relevant state at the time the event happened. That state should be minimized and the receivers should query the model
to access additional information if necessary.

### Immutable

As they represent something in the past, domain events must be immutable. As such they can only contain immutable objects like 
[value objects]({{< ref "docs/business/value-objects.md" >}}), primitive types, strings, etc...

### Simple

Domain events are first and foremost about communication, within the system but also with other systems. A domain
event should therefore be kept as simple as possible as be easy to serialize.

## Declaration

In the business framework a domain event is a special sub-type of value object. To create a domain event with the 
business framework, you have two alternatives.

{{% tabs list="Basic|Interface" %}}
{{% tab "Basic" true %}}
Extend the {{< java "org.seedstack.business.domain.BaseDomainEvent" >}} class:

```java
public class SomeDomainEvent extends BaseDomainEvent {
    private String attribute1;
    private String attribute2;

    public SomeDomainEvent(String attribute1, String attribute2) {
        this.attribute1 = attribute1;
        this.attribute2 = attribute2;
    }

    // Other methods
}
```

By extending {{< java "org.seedstack.business.domain.BaseDomainEvent" >}}, you will have a default implementation of the
`equals()` and `hashCode()` methods, consistent with the definition of a value object. A `toString()` is also provided by default.
{{% /tab %}}
{{% tab "Interface" %}}
Implement the {{< java "org.seedstack.business.domain.DomainEvent" >}} interface:

```java
public class SomeDomainEvent implements DomainEvent {
    private String attribute1;
    private String attribute2;

    public SomeDomainEvent(String attribute1, String attribute2) {
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

Implementing {{< java "org.seedstack.business.domain.DomainEvent" >}} allows you to fully control the inheritance of your
event. However, you will have to implement `equals()` and `hashCode()` methods yourself, consistently with the definition 
of a value object (i.e. based on all the event attributes). 
{{% /tab %}}
{{% /tabs %}}

## Usage

{{% callout info %}}
Events are published and received **synchronously**.
{{% /callout %}}

### Publishing events

To publish an event, inject {{< java "org.seedstack.business.EventService" >}} where required: 

```java
public class SomeClass {
    @Inject
    private EventService eventService;
    
    public void someMethod() {
        eventService.fire(new SomeDomainEvent("val1", "val2"));
    }
}
```

### Subscribing to events

To subscribe to an event, simply create a class implementing the {{< java "org.seedstack.business.EventHandler" >}} interface
with the class of the event to subscribe to as generic parameter:

```java
public class SomeEventHandler implements EventHandler<SomeDomainEvent> {
    @Override
    public void handle(SomeDomainEvent someDomainEvent) {
        // handle event
    }
}
```

{{% callout tips %}}
Multiple handlers can be declared for the same type of event, allowing any part of the system to react to any event that
happened in the domain.
{{% /callout %}}

{{% callout tips %}}
If you have an event hierarchy, you can subscribe at any level in this hierarchy. Subscribing to a particular event class
implies that you will receive events of this class and all its sub-classes.
{{% /callout %}}

