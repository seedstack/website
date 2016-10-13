---
title: "Introduction"
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
logic efficiently. It is based on the **"Domain-Driven Design (DDD)"** software development approach from which it implements
the main concepts. Following the DDD principles will help you to produce a supple and scalable design. Using the business
framework will help you to implement it quickly and cleanly.

The term term has been coined by Eric Evans in his book "Domain-Driven design", published in 2003. It is an approach of
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
source material described in the [bibliography](bibliography).
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
    * Know when NOT use them.

Some patterns are widely employed in the business framework and in SeedStack in general. Having a good understanding of
them is required.

# The business framework

The business framework is a Java implementation of the DDD approach that builds upon the java framework to provide 
high-level, ready to use building blocks. To add the business framework to your project, add the following dependency:

{{< dependency g="org.seedstack.business" a="business-core" >}}

Your will be guided through the design and development of your project but it is crucial for its success to understand the 
concepts and the associated building blocks. While the business framework provides a rich set of helpers and base 
implementations, no code is generated. **The development team has to design and write the code, according to this 
documentation and the DDD philosophy.**

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

A majority of DDD concepts are implemented as building blocks by the business framework to help you code faster. But you
don't always want to go for the fastest implementation and may need to abstract your code from the framework a bit further.

# Three abstraction levels

The business framework allows you to choose the abstraction level you want for your code. There are three abstraction
level that can you can choose from, on a class-by-class basis:

* **Annotation level**. You can make the framework recognize your classes simply by annotating them. No need to implement any
interface, nor extend base classes. While this mode is great for decoupling your code from the framework you may find that
some of the helpers cannot work these classes as they won't have the required signatures. You will have full dependency
injection though, provided that you define interfaces for your classes yourself. *Framework coupling is at the minimum
but development speed is reduced. Also note that this mode is preferably reserved to people fluent with DDD principles.*
* **Interface level**. Implementing framework interfaces will make the framework recognize your classes and will allow
it to work with them as they will have the required signatures. In this mode you benefit from full dependency injection
and almost full framework functionality. Some predefined behaviors may be missing for some objects like out-of-the-box
equality for entities and value objects. *It is a good balance between framework coupling and development speed and is
suitable to people that know the DDD principles well.*
* **Base class level**. Extending framework base classes will provide you full framework functionality, including base
behavior. *Framework coupling is higher but a higher development speed is gained. It allows people starting with DDD to
benefit from implementation correctness in various areas.*

{{% callout info %}}
Note that although you can mix the three levels in the same project, it is recommended to define which approach suits
your team best and stick with it.
{{% /callout %}}

# Code pattern detection

To recognize your classes, the business framework scans them and recognize code patterns depending on the abstraction
level you use (see above). It works in two steps:

* First it scans interfaces that are annotated with a recognized concept,
* Then is collects classes implementing those interfaces. If multiple implementations are found for an interface, it
can detects qualifiers to differentiate them. See [qualified injection](#qualified-injection) below for more information.

Once a code pattern is properly recognized, it can be injected through its interface in any managed instance.

{{% next href="manual" label="start reading the manual..." %}}
