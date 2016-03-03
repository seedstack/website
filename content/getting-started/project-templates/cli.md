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
to provide command-line commands.

# Creation

To create a command-line application project from scratch, run the following command:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=cli
```
    
This will invoke the generate goal of the SeedStack maven plugin which will select the latest version of the SeedStack
distribution and use its CLI Maven archetype. The process is interactive and will ask you a few questions about the project
to be created.

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
to add any business domain to your project. You can also choose to put the domain in a separate [domain module](../domain).
{{% /callout %}}

# More resources

* [CLI documentation](/docs/seed/manual/cli).
* [Simple CLI example](https://github.com/seedstack/samples/tree/master/cli).