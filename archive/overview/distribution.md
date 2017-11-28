---
title: "Distribution"
type: "home"
zones:
    - "Overview"
sections:
    - "OverviewEssentials"
tags:
    - essentials
menu:
    docs:
        weight: 2
---

SeedStack is distributed as a collection of software components that can be composed together as needed. To ensure that you
get a coherent, well-tested set of components, they are packaged in the SeedStack distribution. It is a special Maven POM 
file (BOM) that you reference in your own project to import SeedStack dependency management rules.<!--more-->

# Benefits

The SeedStack distribution is the preferred way of using SeedStack in your project:
 
* All components have their version managed globally. You just have to specify the distribution version but not the
version of the components themselves.
* All components are tested together before the release.
* The distribution is released 3 times per year with a predictable schedule (April, July and November).
* The distribution is named after the `YEAR.MONTH` pattern.
* The distribution contains quick-start project templates. 

# Usage 

The most important aspect of the distribution is the dependency management which guarantees that all SeedStack components
are at compatible and well-tested versions. To benefit from dependency management in your project, just add the following
snippet in your project root POM:
  
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.seedstack</groupId>
                <artifactId>seedstack-bom</artifactId>
                <version>{{< version g="org.seedstack" >}}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        <dependencies>
    <dependencyManagement>

With this import, all artifacts under `org.seedstack.*` group identifiers have their version managed. 

{{% callout info %}}
You can still override the version of a particular component by adding a specific dependency management AFTER the import:

    <dependencyManagement>
        <dependencies>
            <!-- SeedStack BOM import here -->
            
            <dependency>
                <groupId>org.seedstack.seed</groupId>
                <artifactId>seed-rest-jersey2</artifactId>
                <version>__OVERRIDEN_VERSION__</version>
            </dependency>
        <dependencies>
    <dependencyManagement>
{{% /callout %}}

# Composite dependencies

Composites are POM-type dependencies that can be added to your project modules. Each is a typical set of SeedStack components
that are useful for a particular use case like REST microservice, batch job, business domain... To add a composite dependency 
to one of your modules, add the following dependency snippet:

    <dependency>
	    <groupId>org.seedstack</groupId>
		<artifactId>???-composite</artifactId>
		<type>pom</type>
	</dependency>

The available composites are:

* The `batch` composite is for batch jobs.
* The `cli` composite is for command-line programs.
* The `domain` composite is for reusable domain modules.
* The `rest` composite is for REST microservices.
* The `web` composite is for classic Web applications with a user interface.

{{% callout tips %}}
It is recommended to only use one composite per project module. Note that you can add any additional dependency you may 
require (such as add-ons), besides the composite.
{{% /callout %}}

# Archetypes

The distribution contains [Maven archetypes](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html)
for typical project types. The archetypes are used by the [generate goal](../maven-plugin/generate/) of the SeedStack Maven 
plugin to provide project generation.

{{% callout info %}}
Learn how to use these archetype by creating a project by reading the [getting started section](/getting-started).
{{% /callout %}}

# Custom distribution

It is possible to create a custom distribution for your organization. This can be useful:
 
* To manage your own organization-specific add-ons and provide dependency management for them,
* To override the version of some of SeedStack components by a newer or older one.

{{% callout tips %}}
Maven dependency management import is transitive so you can import the SeedStack open-source BOM in your own and only 
specify the differences after the import.
{{% /callout %}}
