---
title: "Java framework"
type: "home"
layout: "seed-content"
menu:
    SeedIntroduction:
        weight: 10
---

SeedStack Java framework, also simply known as « Seed », is a **modular** backend solution designed to create enterprise-grade
applications. It provides easy integration of numerous technologies and Java standards through the **IoC pattern** and
**dependency injection**.

# A kernel and its plugins

At the heart of the framework lies the kernel which is started by different means, depending on the runtime context (web
application, standalone java app, test runner, ...). The responsibility of the kernel is to orchestrate all the plugins 
in order to setup a fully functioning application. In turn, each plugin has its own responsibility such as providing 
application configuration, integrating a specific technology or augment the application code with a particular behavior.

Plugins are detected by the kernel through the Service Loader mechanism and their methods are called at various stages
of the application lifecycle.

Seed Java only needs the **seed-core-support** module to work. After it is up to you to decide which modules you want to 
add in your project: REST, JPA, JMS, etc. But instead of grabbing all the modules by hand, the SEED stack provides an easy 
integration with maven boms and composites to help you start with good defaults. See the
[Dependency management](#!/seed-doc/introduction/dependency-management)
chapter for more information.

# How to find information ?

If you are looking for general information about SEED, please go in the
[Core documentation](#!/seed-doc/core).  If it is about a specific
feature, find the documentation of the corresponding module [here](#!/seed-doc)
The documentation is organized around the modules and as such, reflects
the project maven structure.

# Architecture

SEED Java is structured in modules called supports. The goal of a
support is to integrate a specific technical feature. It can be be a Java Specification
Request (JSR), a specific product or any technology . Supports should respect the
[SOLID](http://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29)...

- **S**ingle responsibility principle
- **O**pen/closed principle
- **L**iskov substitution principle
- **I**nterface segregation principle
- **D**ependency inversion principle

...and [KISS](http://en.wikipedia.org/wiki/KISS_principle) (Keep It
Simple and Stupid) principles
<br/><br/>
To reflect those principles the supports are organized with the
following conventions:

- `seed-???-spec` for API and SPI
- `seed-???-test` for testing API
- `seed-???-core` for implementation
- `seed-???-[technology]` for implementation of additional technology

Where `???` is the name of the support. This organization allows us
to reuse the same API for multiple implementations.

# Dependency injection

SEED is based on Nuun.io a powerful and flexible inversion control
framework. Nuun provides at its core the support for the JSR 330. But
notice that Nuun is not a dependency injection framework. It uses
Google Guice for that. Why Guice ? Just because we think it is the best java DI
framework regarding performance and features. On top of Guice, Nuun adds
a way to declare injection bindings dynamically, according to framework-defined
specifications.

It allows us to declare all the injections bindings in our supports.Please
check the corresponding documentations to learn about how to use each
injection.

# Configuration

There is no XML configuration required by SEED. Yeah! The integration between
the components is fully automatic and we use props files for the real configuration.
Furthermore, we carefully chose the default values to let specify only the minimum.
See the related [documentation](#!/seed-doc/core/configuration) in the core
module for more information.
