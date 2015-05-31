---
title: "Introduction"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedIntroduction"
menu:
    SeedIntroduction:
        weight: 10
---

SeedStack Java framework, also simply known as « Seed », is a **modular** backend solution designed to create enterprise-grade
applications. It enables quick integration of numerous technologies and Java standards at a **very low cost**
and is easily **extensible**.

# Contents

The framework is composed of "supports", each one providing a particular technology. Support can be used independently 
of each other. The typical support organization is:

* A specification module, named "specs", containing APIs and SPIs.
* One or more implementation module(s). The main implementation module is named "core". If additional implementation
modules are provided, they are named according to their contents.
* A test module, named "test", containing specific testing tools and fixtures if any.
 
Simpler supports consists of only one module, containing the APIs, the SPIs and the implementation. For more information
about how a supports is organized internally, have a look [here](concepts/modularity).

{{% callout info %}}
Adding the implementation module of a support to your classpath is enough to activate it. The support will initialize
itself automatically and search your codebase or the configuration for things to do. If nothing is found it will 
deactivate itself after printing a message to the log. 
{{% /callout %}}