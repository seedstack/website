---
title: "CLI application"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTemplates"
menu:
    GettingStartedProjectTemplates:
        weight: 40
---

A command-line (CLI) application project is a executable JAR module. It is intended to contain only backend Java classes
to provide command-line commands.<!--more-->

# Creation

You need to have [Apache Maven 3.1+](https://maven.apache.org/) installed. 
To create a command-line application project from scratch, run the following command:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=cli
```
    
{{% callout info %}}
This will invoke the generate goal of the SeedStack maven plugin [generate goal]({{< ref "docs/overview/maven-plugin/generate.md" >}}) which will:

* Discover the latest version of the [SeedStack reference distribution]({{< ref "docs/overview/distribution.md" >}}),
* Use its [batch archetype](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22org.seedstack%22%20a%3A%22cli-archetype%22) to generate the project.

The process is interactive and will ask you a few questions about the project to be created.
{{% /callout %}}

# Result
 
After execution, a single module project is created:

```plain
- mycli
    |- src
        |- main
        |   |- java
        |   |   |- org.myorg.mycli
        |   |       |- [application]    <-- application logic
        |   |       |- cli              <-- command-line handlers
        |   |       |- [domain]
        |   |       |   |- [model]      <-- domain model
        |   |       |   |- [services]   <-- domain services
        |   |       |- [infrastructure] <-- technical infrastructure
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

# More resources

* [CLI documentation]({{< ref "docs/seed/manual/cli.md" >}}).
* [Simple CLI example](https://github.com/seedstack/samples/tree/master/cli).