---
title: "Kernel + plugins architecture"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedConcepts"
tags:
    - "plugin"
    - "lifecycle"
    - "modularity"
menu:
    SeedConcepts:
        weight: 20
---

At the heart of the framework lies the kernel which is started by different means, depending on the runtime context (web
application, standalone java app, test runner, ...). The responsibility of the kernel is to orchestrate all the plugins 
in order to setup a fully working application. In turn, each plugin has its own responsibility such as providing
application configuration, integrating a specific technology or augment the application code with a particular behavior.

# Application lifecycle

The kernel orchestrates the application lifecycle through the following phases:  

1. In the *bootstrapping phase*, the runtime starts the kernel which uses the Java service loader mechanism to detect 
all the plugins present in the classpath. These plugins register their classpath information requests to the kernel and 
express their requirements on other plugins.
2. In the *initialization phase*, the kernel resolve all the classpath requests in only one full classpath scan and invoke
the initialization logic of all plugins in the correct order.
3. In the *starting phase*, the kernel collects the IoC bindings dynamically defined by each plugin from the results of 
the initialization phase and builds the application main injector. Then the kernel invokes the starting logic of all 
plugins in the correct order. At this point, the application is fully operational.
4. In the *stopping phase*, the runtime stops the kernel which invokes the stopping logic of all plugins in the correct 
order. A this point, the application is stopped.

Kernel start and stop is controlled by a simple API which is invoked by different means, depending on the nature of the
application (a servlet context listener for web applications, a main method for batch jobs, a test runner for integration
tests, ...).

# More information

The kernel is a part of [Nuun IO](https://github.com/nuun-io) and is independent of SeedStack. For more information
about it, please check [its own documentation](https://github.com/nuun-io/kernel/wiki).