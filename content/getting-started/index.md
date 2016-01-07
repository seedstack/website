---
title: "Introduction"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedIntroduction"
menu:
    GettingStartedIntroduction:
        weight: 10
---

**SeedStack is a comprehensive software development stack** aimed at application or service creation. It addresses both
backend and frontend needs in a modular yet seamless solution. It means that you can cherry-pick the components or
choose to take advantage of the full stack for maximum development speed.

**SeedStack is strongly opinionated** and, as such, not an ubiquitous solution for every need. Its main focus is on helping
you to build better applications or services, ones that will be valuable assets in the long run and that you can evolve
and maintain as long as needed. It does so by providing:

  * A highly modular architecture,
  * Integration of a wide range of curated technologies,
  * Easy-to-use building blocks.

**SeedStack is designed with enterprise-class requirements in mind**. High modularity, powerful configuration, advanced
security, self-monitoring or side-channel administrative commands are typical examples of such features. They are easy
to configure if you need them and won't get in your way if you don't. In fact, SeedStack high modularity allows you to
only include the features you really need for each project.

**SeedStack is customizable and extensible at multiple levels**. Beyond configuring and extending each component, you can
tailor the whole stack to your personal or organization needs. The concept of distribution allows you to create a custom
solution with its own component choices, conventions and templates that you can then apply to all your organization
projects. We provide a reference Open-Source distribution for common needs but massive gains can be found by creating
your own (proprietary or not), especially if your organization is mid-sized or large.

# Composition

SeedStack is made of three major frameworks:

* **The Java framework**, also known as Seed, is the foundation of the application or service backend. Its role is to
provide access to a range of technologies from application code.
* **The Web framework**, also known as W20, is the foundation of the application Web frontend if any. At its core, it
seamlessly integrates RequireJS and AngularJS to enable the creation of composite Web frontends. It also provides a
complete Bootstrap-based UI solution.
* **The Business framework** is the foundation of your business code. Based on the Domain-Driven Design
methodology, it implements all its concepts as read-to-use building blocks. It also provides various services often
needed around business code.

![Stack diagram](img/stack.svg)

Modularity is at the heart of SeedStack so you can tailor the solution to your exact needs by adding only the relevant
components. Components are mostly independent of each other and, although there are dependencies between some of them,
they are kept to a minimum.

{{% callout info %}}
There are two main technologies found in SeedStack:

* **Java** components which are distributed as Maven artifacts on [Maven Central](http://search.maven.org),
* **HTML/CSS/JS** components which are distributed with [Bower](http://bower.io/search/). These components are also
repackaged as Maven artifacts if Bower is unavailable in your environment.
{{% /callout %}}
