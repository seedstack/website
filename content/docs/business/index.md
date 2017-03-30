---
title: "Business framework"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessEssentials"
tags:
    - essentials
    - domain-driven design
menu:
    BusinessEssentials:
        weight: 10
---

SeedStack business framework is a simple and coherent set of building blocks that enable you to code high quality business 
logic efficiently.<!--more--> 

# Domain-Driven Design

The business framework is based on the **Domain-Driven Design (DDD)** software development approach from which it implements
the tactical patterns. Following the DDD principles will help you to produce a supple and scalable design. Using the business
framework will help you to implement it quickly and cleanly.

The term has been coined by Eric Evans in [his book]({{< ref "docs/business/bibliography/index.md" >}}) "Domain-Driven design", 
published in 2003. It is an approach of software development based on the following premises:

* Placing the project's primary focus on the core domain and domain logic.
* Basing design on a model of the domain.
* Initiating a creative collaboration between technical and domain experts to iteratively refine a conceptual model that 
addresses particular domain problems.

DDD really shines when applied on medium to complex business needs but can also be used successfully on simpler projects, 
especially since the business framework considerably lowers the cost of implementing such projects by providing many 
helpers and base implementations.

{{% callout ref %}}
You can learn about what DDD is about in [DDD basics]({{< ref "docs/business/ddd-basics/index.md" >}}). 
From there you can go further by reading source material described in the [bibliography]({{< ref "docs/business/bibliography/index.md" >}}).
{{% /callout %}}

# The business framework

The business framework is a Java implementation of the DDD approach that builds upon the [Java framework]({{< ref "docs/seed/index.md" >}}) 
to provide:

* A set of patterns both from DDD and from more general object-oriented programming,
* Ready to extend base classes,
* Default implementations where possible,
* Helpers and utilities for common tasks.

Using the business framework requires the following dependency in your project:

{{< dependency g="org.seedstack.business" a="business-core" >}}

# Key factors to success

## An iterative process

An iterative design and development process is required to successfully implement DDD in a project. Any agile methodology
that fits the team can be used. Frequent communication between domain experts and the development team is key to get
the model right before too much code is written. This communication should not cease after the first version of the model
is produced because the software will probably be continuously refined until it is no longer needed by the business.

## Business involvement

The domain being the area of application of the software, an access to domain experts is critical to achieve a high quality
model. One goal of the DDD is to express the mental model spread across business experts into a refined, precise and
usable domain model. To be able to achieve this goal, domain experts should contribute to software design by defining
the {{< term "Ubiquitous Language" >}} with the development team.

This collaboration will lead to a software that is exactly what is needed by the business.

## Development

To successfully apply DDD and use the business framework, some prerequisites must be met by the development team:

* Being fluent with Java Object-Oriented (OO) programming paradigm,
* Being familiar with [SOLID principles](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)), 
* Being comfortable with the technical aspects of SeedStack.
