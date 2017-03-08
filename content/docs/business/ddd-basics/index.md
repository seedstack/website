---
title: "Domain-Driven Design basics"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessEssentials"
menu:
    BusinessEssentials:
        weight: 20
---

Domain-Driven Design (DDD) is an approach to the development of software that:
 
* Focuses on the _core domain_.
* Explores models in a creative collaboration between business experts and the software team.
* Defines an ubiquitous language within an explicitly _bounded context_.

Domain-Driven Design has two sides, both equally important: 

* **Strategic design**, which address high-level considerations of domain knowledge and its modeling.
* **Tactical design**, which propose practical patterns to design the required software.

{{% callout info %}}
The business framework, being an implementation framework, naturally focuses on the tactical side of DDD. Nonetheless,
strategic design should not be overlooked and is a critical aspect of designing sustainable software.
{{% /callout %}}

# Definitions

## Domain
A sphere of knowledge, influence, or activity. The subject area to which the user applies a program is the domain of the software.

## Model
A system of abstractions that describes selected aspects of a domain and can be used to solve problems related to that domain.

## Ubiquitous language
A language structured around the domain model and used by all team members within a bounded context to connect all the activities of the team with the software.

## Context
The setting in which a word or statement appears that determines its meaning. Statements about a model can only be understood in a context.

## Bounded context
A description of a boundary (typically a subsystem, or the work of a particular team) within which a particular model is defined and applicable.

# Strategic design

Strategic design has nothing to do with code. It is about identifying and understanding the business mindset, language and 
solutions. Ultimately, a significant part of the domain knowledge will be implemented as code but it needs to be well
understood and structured first.

# Tactical patterns

The following diagram represents the key patterns of tactical Domain-Driven Design and how they relate to each other. 
This manual will describe all those patterns and how they can be implemented with SeedStack.

![Tactical domain-driven design](img/all-domain.png)
