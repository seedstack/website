---
title: "Java framework"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedIntroduction"
tags:
    - "modular"
    - "jar"
    - "package"
    - "lifecycle"
    - "classpath"
menu:
    SeedIntroduction:
        weight: 10
---

SeedStack Java framework, also simply known as "Seed", is a comprehensive solution enabling you to build Java applications
or cloud services easily and efficiently.<!--more-->

# Opinionated...

Whatever you aim to build, from a small command-line tool to the next successful cloud-based service, Seed provides you 
with the right set of concepts and technologies from the start. More importantly, it does so without getting in your way
and yet scales well when applied on full-blown enterprise projects.

# ...yet modular

Built on an [extensible plugin system](concepts), Seed is highly modular and allows you to choose the technologies you really
need while leaving out the unnecessary bits. Besides, you can extend the core framework abilities by cherry-picking modules
from the [add-ons library](/addons) or by rolling-out your own.

The framework is composed of several separate modules, each one providing a particular technology. The `seed-core` module
implements basic framework functionality like application lifecycle, configuration or dependency injection. Its presence 
is required in any running application along its companion module `seed-specs`, containing the corresponding API classes.

{{% callout info %}}
Modules are automatically detected and activated when present in the classpath. As such, simply adding a module JAR to 
your project will enable it and all its features. 
{{% /callout %}}

## JAR organisation

When relevant, modules provide their API in a separate sub-module suffixed with `-specs` in which case the corresponding
module implementation is suffixed `-core`. This allows to implement classes using the API without activation. This is 
useful when designing reusable components. Besides, to provide a better separation of concerns, some modules are further
split into optional sub-modules:

* `seed-[module]-specs` for the API and/or the SPI,
* `seed-[module]-core` for the main implementation,
* `seed-[module]-[option]` for an optional implementation module.

## Package organisation

The code of each module lives in several Java packages, all prefixed by org.seedstack.seed.???, where ??? is the name 
of the module:

* `org.seedstack.seed.[module]` which contains classes destined to be used by client code,
* `org.seedstack.seed.[module].spi` which contains the classes needed to extend the module features,
* `org.seedstack.seed.[module].internal` which contains the module internal classes,
* `org.seedstack.seed.[module].test` which contains testing tools for the module.

{{% callout danger %}}
Note that application code should **never** rely on any class from the internal package. It is implementation-specific
and subject to change between versions without notice.
{{% /callout %}}

## Class organisation

Seed follows [SOLID principles](https://en.wikipedia.org/wiki/SOLID_\(object-oriented_design\)) and each class tend to only
have one responsibility, allowing to easily understand what it does. It also does help to keep you implementation simple
and testable.

# Lifecycle

At the heart of Seed lies the kernel which is started by different means, depending on the runtime context (web 
application, standalone java app, test runner, ...). The responsibility of the kernel is to orchestrate all the plugins 
in order to setup a fully working application. In turn, each plugin has its own responsibility such as providing 
application configuration, integrating a specific technology or augment the application code with a particular behavior.

## Classpath scanning

At the start of kernel, all plugins have the opportunity to request information about classes and resources. Using this
mechanism, they can detect predefined code patterns such as:
 
* Classes annotated or meta-annotated with a specific annotation,
* Classes implementing an interface or extending a base class,
* Classes matching a complex predefined specification, 
* Resources matching a specific regex,
* etc...

{{% callout info %}}
Code pattern detection is heavily used throughout SeedStack, for instance to dynamically define injection bindings, to 
automatically register classes or to enable particular features. Combined with the convention-over-configuration principle
and sensible default values, it greatly simplifies SeedStack usage.    
{{% /callout %}}

## Phases

The kernel orchestrates the application lifecycle through the following phases:

* In the bootstrapping phase, the runtime starts the kernel which uses the Java service loader mechanism to detect all 
the plugins present in the classpath. These plugins register their classpath information requests to the kernel and express 
their requirements on other plugins.
* In the initialization phase, the kernel resolve all the classpath requests in only one full classpath scan and invoke 
the initialization logic of all plugins in the correct order.
* In the starting phase, the kernel collects the injection bindings dynamically defined by each plugin from the results of the 
initialization phase and builds the application main injector. Then the kernel invokes the starting logic of all plugins 
in the correct order. At this point, the application is fully operational.
* In the stopping phase, the runtime stops the kernel which invokes the stopping logic of all plugins in the correct 
order. A this point, the application is stopped.

{{% callout info %}}
The kernel is a part of [Nuun IO](https://github.com/nuun-io) and is independent of SeedStack. For more information
about it, please check [its own documentation](https://github.com/nuun-io/kernel/wiki).
{{% /callout %}}

{{% next href="manual" label="start reading the manual..." %}}
