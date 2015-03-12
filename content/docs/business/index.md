---
title: "Overview"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessIntroduction"
menu:
    BusinessIntroduction:
        weight: 10
---

SeedStack business framework is a simple and coherent set of building blocks that enable you to code high quality business 
logic efficiently. It is based on the **Domain-Driven Design (DDD)** software development approach from which it implements 
the main concepts. Following the DDD principles will help you to produce a supple and scalable design. Using the business
framework will help you to implement it quickly and cleanly.

# Domain-Driven-Design

The term has been coined by Eric Evans in his book "Domain-Driven design", published in 2003. It is an approach of
software development for medium to complex needs, based on the following premises:

* Placing the project's primary focus on the core domain and domain logic.
* Basing design on a model of the domain.
* Initiating a creative collaboration between technical and domain experts to iteratively refine a conceptual model that 
addresses particular domain problems.

DDD really shines when applied on medium to complex business needs but can also be used successfully on simpler projects, 
especially since the business framework considerably lowers the cost of implementing such projects by providing many 
helpers and base implementations.

{{% callout info %}}
This documentation is not intended to replace a good understanding of DDD principles which can be gathered from various
source material described in the [bibliography](bibliography). Nonetheless, you will find an introduction to 
DDD in general and a presentation of its main concepts in the [concepts](concepts) section.
{{% /callout %}}

# The business framework

The business framework is a Java implementation of the DDD approach that builds upon the java framework to provide 
high-level, ready to use building blocks.  

Your will be guided through the design and development of your project but it is crucial for its success to understand the 
concepts and the associated building blocks. While the business framework provides a rich set of helpers and base 
implementations, no code is generated. The development team has to design and write the code, according to this 
documentation and the DDD philosophy.

Sometimes, several design or implementation choices are possible for a given business need. In that case, the pros 
and cons of each choice are presented to help you decide which is right for you specific need. When available, additional 
source material is referenced for a further understanding.

{{% callout info %}}
Because the business framework is mostly about development, it focus itself on the {{< term "tactical side" "tactical-design" >}} 
of DDD with the implementation of concepts such as entities, repositories, aggregates and so on. But there is a 
{{< term "strategic side" "strategic-design" >}} to DDD that you shouldn't overlook and is crucial to your project success, 
especially if its domain is large or complex. SeedStack inherent modularity will help you to separate bounded contexts 
in modules and reuse them across multiple projects easily.   
{{% /callout %}}

# Requirements

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

This collaboration will lead to a software that is exactly what is needed by business.

## Development

To successfully apply DDD and use the business framework, some prerequisites must be met by the development team:

* Being fluent with Object-Oriented (OO) programming paradigm with a focus on polymorphism, encapsulation and composition.
* Have a good knowledge of design patterns:
    * Identify patterns,
    * Know when to use them,
    * Know when to NOT use them.

Some patterns are widely employed in the business framework and in SeedStack in general. Having a good understanding of
them is required. 