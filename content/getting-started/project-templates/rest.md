---
title: "REST micro-service"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTemplates"
menu:
    GettingStartedProjectTemplates:
        weight: 30
---

A REST micro-service project is an executable JAR module embedding the Undertow Web server. It is intended to only contain
backend Java classes to provide a REST API. It is the ideal template for lightweight REST micro-services.<!--more-->

# Creation

You need to have [Apache Maven 3.1+](https://maven.apache.org/) installed. 
To create a REST micro-service project from scratch, run the following command:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=rest
```

{{% callout info %}}
This will invoke the generate goal of the SeedStack maven plugin [generate goal]({{< ref "docs/overview/maven-plugin/generate.md" >}}) which will:

* Discover the latest version of the [SeedStack reference distribution]({{< ref "docs/overview/distribution.md" >}}),
* Use its [batch archetype](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22org.seedstack%22%20a%3A%22rest-archetype%22) to generate the project.

The process is interactive and will ask you a few questions about the project to be created.
{{% /callout %}}

# Result

After execution, a single module project is created:

```plain
- myapp
    |- src
        |- main
        |   |- java
        |   |   |- org.myorg.myapp
        |   |       |- [application]    <-- application logic
        |   |       |- [domain]
        |   |       |   |- [model]      <-- domain model
        |   |       |   |- [services]   <-- domain services
        |   |       |- [infrastructure] <-- technical infrastructure
        |   |       |- rest             <-- REST resources and representations
        |   |- resources
        |       |- META-INF
        |           |- configuration    <-- main configuration
        |- test
            |- java
            |- resources
                |- META-INF
                    |- configuration    <-- test configuration
```

{{% callout info %}}
Note that the directory in brackets are not created by the archetype. They are the recommended locations if you need
to add any business domain to your project. You can also choose to put the domain in a separate [domain module]({{< ref "getting-started/project-templates/domain.md" >}}).
{{% /callout %}}

# Conversion to WAR

This project is designed to be run from the command-line with its embedded Web server. To convert it to a classic WAR,
see [this guide](/guides/conversion-to-war).

# More resources

* [REST documentation]({{< ref "docs/seed/manual/rest.md" >}}).
* [Simple REST micro-service example](https://github.com/seedstack/catalog-microservice-sample).

