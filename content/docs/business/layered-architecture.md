---
title: "Layered architecture"
type: "home"
zones:
    - "Docs"
tags:
    - domain-driven design
    - architecture 
aliases: /docs/business/architecture    
menu:
    docs:
        parent: "business"
        weight: 3
---

Domain-Driven Design itself can be successfully applied in variety of software architectural styles. Some are very broad 
and tend to define every aspect of the system, others are more focused and try to address a specific demand.

The business framework itself can adapt to several architectural styles. This documentation will focus on the **traditional
layered architecture** from the Eric Evans DDD book, improved by the usage of the **Dependency Inversion Principle**. 

## The layered architecture

The layered architecture is a classical software architecture that is commonly used in Web, enterprise and desktop 
applications. In this architecture, the concerns are separated into a stack of well-defined layers. 

A strict layered architecture only allows to couple to the layer directly below. It can be used but we recommend a 
**relaxed layered architecture** , which allows any higher-level layer to couple to any layer below it.

![DDD applied to layers architecture](img/layers.png)

## Dependency inversion principle

As you can see in the diagram above, all upper layers are coupled to the infrastructure layer where technical aspects
are implemented. This is not desirable in Domain-Driven Design and we can avoid it by applying the {{< term "Dependency Inversion Principle" >}}.

We move the infrastructure layer to the side, where classes implement interfaces defined by other layers. 
Technical dependencies are injected through these interfaces:

![DDD applied to layers architecture](img/layers_dip.png)

**The interface, application and domain layers are completely decoupled of any technical aspects.** The architecture is made
more flexible by allowing different implementations of an interface to be injected.

{{% callout info %}}
In SeedStack, the Dependency Inversion Principle is implemented by [dependency injection]({{< ref "docs/basics/dependency-injection.md" >}}).
{{% /callout %}}

## Layers

### Domain layer

The Domain Layer is where the **business is expressed**.

- The domain is independent of the use cases of the system, but is used to achieve their realization,
- It is a very **behaviour-rich** and **expressive** model of the domain, based on entities, values objects and aggregates.
- It contains additional blocks, such as domain services, repositories, factories, policies, etc...

### Application layer

The application layer is responsible for **driving the workflow of the application**, executing the use cases of the system.

- These operations are independent of the interfaces by which they are exposed.
- This layer is well suited for **spanning transactions**, high-level **logging** and **security**.
- The application layer is thin in terms of domain logic, it merely **coordinates the domain layer objects** to perform
the actual work through **Application Services**.

### Interface layer

The interface layer contains the components that handle **interactions with other systems**, such as REST resources, 
Web-Services, Web application views, etc...

- It handles the **interpretation**, **validation** and **translation** of the inputs.
- It handles the **serialization** of the outputs, such as DTO classes to JSON, XML, etc.

### Infrastructure layer

The infrastructure layer contains the technology-specific implementations of interfaces defined in other layers.

- It supports all of the three other layers in different ways, facilitating communication between the layers.
- It consists of everything that is external to the system itself: libraries, persistence, server, messaging and so on.
- This layer can be completely replaced by another one with other technological choices without altering the system behavior.
