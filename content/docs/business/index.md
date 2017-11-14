---
title: "Business framework"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessEssentials"
tags:
    - essentials
    - domain-driven design
menu:
    BusinessEssentials:
        weight: 10
---

SeedStack business framework is a simple and coherent set of building blocks that enable you to code high quality business 
logic efficiently.<!--more--> 

It is a Java implementation of the [Domain-Driven Design (DDD)]({{< ref "docs/business/ddd-basics/index.md" >}}%) software
approach that provides:

* A set of design patterns,
* A rich Java API to implement these patterns,
* Default implementations to avoid boilerplate code,
* Helpers and utilities for common tasks like pagination.

To use the business framework, add the following dependency to your SeedStack project:

{{< dependency g="org.seedstack.business" a="business-core" >}}

{{% callout tips %}}
If you're using Maven, SeedStack provides a BOM file that you can import in your project. This ensures that you have the
correct versions of each component and avoid specifying them in each dependency. See the [distribution page]({{< ref "docs/overview/distribution.md" >}}) 
for more information.
{{% /callout %}} 
