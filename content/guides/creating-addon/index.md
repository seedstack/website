---
title: "Creating an add-on"
name: "Creating an add-on"
author: "SeedStack"
date: 2016-08-31
weight: -1
zones:
    - Guides
---

SeedStack is an extensible solution that can be enriched with add-ons to provide new functionality or features.
Writing an add-on is not a difficult task as it is very similar to writing an application but some rules and
conventions must be obeyed. This guide will describe these rules and conventions.<!--more-->
 
# Project structure
 
An add-on almost always consists in an API/SPI with one or more implementations. Depending on the complexity of
the add-on and the re-usability requirements, several project structures can be used.

## Single-module add-on

The simplest form of add-on is a single module project. In this case, the API/SPI and the implementation will be
contained in a single JAR artifact. The typical single-module add-on structure is:

```plain
single-addon
    |- src/main/java
    |   |- org.myorg.feature    <-- API goes in the add-on base package
    |       |- internal         <-- Implementation            
    |       |- spi              <-- SPI if any
    |- src/test/java
        ...
```

{{% callout info %}}
Example single module add-on: https://github.com/seedstack/jpa-addon
{{% /callout %}}    
  
## Add-on with a separated API/SPI

When you need to provide the API/SPI to clients separately from the implementation you need to create a multi-module
add-on:

* The `specs` module will contain the API (and the SPI if any),
* The `core` module will contain the implementation.

The typical structure for such add-on is:

```plain
multi-addon
    |- core
    |   |- src/main/java
    |   |   |- org.myorg.feature    
    |   |       |- internal         <-- Implementation            
    |   |- src/test/java
    |       ...
    |- specs        
    |   |- src/main/java
    |   |   |- org.myorg.feature    <-- API goes in the add-on base package
    |   |       |- spi              <-- SPI if any
    |   |- src/test/java
            ...
```
    
{{% callout info %}}
Java packages are still the same that found in the single module add-on but segregated in two maven modules.
{{% /callout %}}    

## Multiple implementations add-on

When you have multiple implementations or implementation extensions for an add-on you can add a new sub-module per
implementation/extension. This type of add-on is the same a the previous one with additional sub-modules:
 
* The `specs` module will contain the API (and the SPI if any),
* The `core` module will contain the main/common implementation,
* The `impl1` module will contain the `impl1` implementation,
* The `impl2` module will contain the `impl2` implementation,
* ...

```plain
multi-addon
    |- core
    |   |- src/main/java
    |   |   |- org.myorg.feature    
    |   |       |- internal         <-- Main/common implementation            
    |   |- src/test/java
    |       ...
    |- impl1
    |   |- src/main/java
    |   |   |- org.myorg.feature.impl1    
    |   |       |- internal         <-- Implementation/extension 1            
    |   |- src/test/java
    |       ...
    |- impl2
    |   |- src/main/java
    |   |   |- org.myorg.feature.impl2    
    |   |       |- internal         <-- Implementation/extension 2            
    |   |- src/test/java
    |       ...
    |- specs        
    |   |- src/main/java
    |   |   |- org.myorg.feature    <-- API goes in the add-on base package
    |   |       |- spi              <-- SPI if any
    |   |- src/test/java
            ...
```

{{% callout tips %}}
If you don't have any API, like when it is provided by a third party, you can omit 
the specs module completely.
{{% /callout %}}

{{% callout info %}}
Example multi-module add-on: https://github.com/seedstack/i18n-addon
{{% /callout %}}

# Dependencies

As the add-on is a reusable component which will be used in various contexts, the rules on dependencies are
tighter than on applications.
 
{{% callout tips %}}
As a general rule, try to minimize the number of dependencies in your add-on to help avoid 
unintended side-effects and limit its impact on client projects.
{{% /callout %}} 

* Any dependency that will be provided by the client project or its runtime environment must
be specified with a `provided` scope. The meaning here is that the dependency is required for
proper operation but must be provided downstream.
* If your add-on contains optional features that have dependencies you have two options:
  * Either package those features in their own implementation sub-module with their own dependencies, 
  * Or package those features in the core implementation, mark their dependencies as `optional` and use
conditional code to initialize those features only when their dependency requirements are met.

# API/SPI

All API classes go in the base package of the add-on. All SPI classes go in a `spi` subpackage of the base package. Try
to keep the API classes as flat as possible, ideally without subpackage.

# Implementation 

All implementation classes go in a `*.internal.*` which is completely excluded from backwards compatibility requirements
between versions.

