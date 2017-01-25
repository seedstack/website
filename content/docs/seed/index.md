---
title: "Basics"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedEssentials"
tags:
    - "java"
    - "startup"
    - "shutdown"
    - "lifecycle"
menu:
    SeedEssentials:
        weight: 10
---

SeedStack Java framework, also simply known as "Seed", is the foundation enabling you to build Java microservices easily 
and efficiently.<!--more--> It can be optionally completed by:
 
* The [business framework](/docs/business) for writing advanced business code,
* Any [official add-on](/addons),
* Any third-party add-on or library. 

# Core dependency

A minimal SeedStack project only requires the `seed-core` module and its dependencies in the classpath. We recommend
using a dependency manager like [Maven](http://maven.apache.org) or [Gradle](http://gradle.io):

{{< dependency g="org.seedstack.seed" a="seed-core" >}}

{{% callout tips %}}
If you're using Maven, SeedStack provides a BOM file that you can import in your project. This ensures that you have the
correct versions of each component and avoid specifying them in each dependency. See the [distribution page]({{< ref "docs/overview/distribution.md" >}}) 
for more information.
{{% /callout %}} 

# Other dependencies

Java framework non-core functionality is available as separate modules. The documentation describes how to add such
modules when needed.
