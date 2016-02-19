---
title: "Distribution"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedDistribution"
menu:
    GettingStartedDistribution:
        weight: 10
---

SeedStack modular design involves a lot of small modules that focus on a particular technology or scope. This enables you
to cherry-pick the modules you really need for your projects and not more. It also allows us to update components 
independently, in their own lifecycle, without disruption to other parts of the stack.

Usually, managing projects with numerous dependent modules, each with their own lifecycle, can be a complex task. Not so 
much with the SeedStack distribution which **automatically handles the dependency management for you**. The main benefits of 
using the distribution over manual management of dependencies are:

* All component versions are managed so you won't need to worry about it for any SeedStack dependency,
* Components that are part of a distribution are tested and validated together,
* The distribution provides *composite dependencies* which regroups components that are frequently used together,
* The distribution provides the corresponding project archetypes and code generators.
 
**Using a distribution in your project is almost always the recommended way to go.** It has no additional cost in build
time. Composite dependencies can sometimes add unwanted dependencies but they can be easily excluded or you can choose
to not use the composites at all while still having the benefits of dependency management.

{{% callout info %}}
Each organization can create its own tailored distribution(s) which can include cherry-picked SeedStack components 
along with the organization private components and extensions to the stack. We provide a reference Open-Source 
distribution that can be used as-is or as a base for customization. 

This page is only about the reference distribution. For more information about creating your own distribution, please
check [this page](create-your-own).
{{% /callout %}}

# Dependency management

To benefit from the dependency management of the distribution, just add the following dependency management snippet
to your root pom.xml:

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.seedstack</groupId>
                <artifactId>seedstack-bom</artifactId>
                <version>???</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        <dependencies>
    <dependencyManagement>

All components under `org.seedstack.*` group identifiers are managed.

# Composite dependencies

Composites are POM-type dependencies that can be added to your various project modules. They regroup multiple modules 
that a frequently used together and often necessary in SeedStack application. To add a composite dependency to one of
your modules, add the following dependency snippet:

    <dependency>
	    <groupId>org.seedstack</groupId>
		<artifactId>???-composite</artifactId>
		<type>pom</type>
	</dependency>

There are several types of composites targeted for different needs:

* The `domain` composite is intended for use as a dependency to standalone domain modules,
* The `rest` composite is intended for use as a dependency to REST micro-services (without UI).
* The `web` composite is intended for use as a dependency to classic Web applications.
* The `batch` composite is intended for use as a dependency to standalone batch jobs.

{{% callout tips %}}
It is recommended to only use one composite per project module. Note that you can add any additional dependency you may require (such as add-ons), besides the composite.
{{% /callout %}}

# Archetypes and generators

The distribution also contains archetypes for different patterns. They provide an easy way to start developping java web applications, batches, implement domains and rest modules.
