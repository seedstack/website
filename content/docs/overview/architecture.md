---
title: "Architecture"
type: "home"
zones:
    - "Overview"
sections:
    - "OverviewEssentials"
tags:
    - essentials
    - architecture
menu:
    OverviewEssentials:
        weight: 30
---

SeedStack is an integration solution, bringing together the best open-source libraries in a clean and consistent 
architecture. To do so, it relies on an extensible kernel/plugin architecture that is capable of automatically activating
the plugins present in the classpath.

# An integration stack

Modern microservices and applications are composed of a great number of software components and technologies that must
be integrated with each other. Things like REST resources, persistence, business logic, caching and so on must 
be all initialized, configured and wired properly to make a system operational.

These technical and complex integration tasks are fully automated by SeedStack. By using SeedStack you directly benefit
from a clean, fully automated software architecture and from some of the best technologies open-source has to offer. **SeedStack 
allows you to focus on the high-value code and leave the plumbing to the framework.**

# Kernel + plugin architecture

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

## Lifecycle

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
