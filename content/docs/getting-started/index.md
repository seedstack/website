---
title: "First contact"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedIntroduction"
menu:
    GettingStartedIntroduction:
        weight: 10
---

This section is dedicated to bring your on board quickly. As you may already know if you read the [overview](/overview),
SeedStack is a software development stack composed of multiple components, addressing backend and frontend needs.

Modularity is at the heart of SeedStack so you can tailor the solution to your exact needs by adding only the relevant
components. Components are mostly independent of each other and, although there are dependencies between some of them,
they are kept to a minimum.

{{% callout info %}}
There are two main technologies found in SeedStack:

* **Java** components which are distributed as Maven artifacts on [Maven Central](http://search.maven.org),
* **HTML/CSS/JS** components which are distributed with [Bower](http://bower.io/search/). These components are also
repackaged as Maven artifacts if Bower is unavailable in your environment.

{{% /callout %}}

# Creating a project

SeedStack based projects can be created from scratch but we propose predefined project types that can be generated from
[Maven archetypes](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html) and/or 
[Yeoman generators](http://yeoman.io/). We recommend that you use these predefined project templates, especially if
you are new to SeedStack as they provide several benefits:

* They are immediately executable and deployable after generation,
* They follow best practices, providing clean code organization and good modularity,
* They are easy to use and fast.

Have a look at them [here](creation).





