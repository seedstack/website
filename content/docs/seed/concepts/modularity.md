---
title: "Java framework modularity"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedConcepts"
tags:
    - "modularity"
    - "package"
    - "organization"
    - "structure"
menu:
    SeedConcepts:
        weight: 50
---

One of SeedStack core concepts is modularity. Although the whole solution is rich, you can only pick what you need for
your application, eventually scaling up by adding more technologies later in the development process. Better, SeedStack
encourages and helps you to apply the same modularity principles to your own applicative code.

Modularity is present at multiple levels in SeedStack. This page describe how modularity is applied in the Java framework
context.

# At the JAR level 

The Java framework is structured in modules called supports. The goal of a support is to integrate a specific 
technical feature in the Seed environment, mainly by making it available through the injector and managing its 
initialization and shutdown. The framework provides supports for Java standards (like some JSR), for specific products,
libraries, ... 

## Multi modules supports

Often, supports are further structured into sub-modules in order to provide a better separation of concerns. The most
frequent need for sub-modules is to separate the API from the implementation but it can also be for separating optional
parts from the core of the support. As such the multi-modules supports follow this naming convention:

- `seed-???-support-specs` for the API and/or the SPI,
- `seed-???-support-core` for the main implementation,
- `seed-???-support-test` for the testing tools,
- `seed-???-support-[option]` for an optional implementation module.

Where `???` is the name of the support.

## Mono module supports

Simple supports which don't provide an API on their own and don't have any testing tools nor any option are structured
as one unique module following the naming convention:

- `seed-???-support` for the implementation.

Where `???` is the name of the support.

# At the java package level

The code of each support of the framework lives in several java packages, all prefixed by `org.seedstack.seed.???`, 
where `???` is the name of the support:
  
- `org.seedstack.seed.???.api` which contains the API of the support (needed to **use** the support features),
- `org.seedstack.seed.???.spi` which contains the SPI of the support (needed to **extend** the support features),
- `org.seedstack.seed.???.internal` which contains the internal implementation of the support,
- `org.seedstack.seed.???.test` which contains the testing tools of the support,

Note that applicative code shouldn't rely on any classes inside the `internal` package since it is implementation
specific and subject to change between versions.

# At the plugin level

In the Java framework, each plugin is responsible for one concern only. Supports that needs to address multiple concerns
like the core support contains multiple plugins. This has two main benefits:

* When concern ordering matters (like when multiple interceptions are applied on the same method), it allows to
easily control the order.
* In advanced integration testing, plugins can be selectively activated and, as such, concerns can be independently 
tested. In most cases however, automatic plugin detection is granular enough and should be left activated.

# At the class level

Each interface, annotation or class in SeedStack has only one responsibility, allowing you to easily understand what it
does. It also does help to keep implementation simple and easily testable.
