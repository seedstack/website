---
title: "Batch application"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTemplates"
menu:
    GettingStartedProjectTemplates:
        weight: 50
---

A batch application project is an executable JAR module. It is intended to contain Spring batch jobs and their associated
Java classes.

# Creation

You need to have [Apache Maven 3.1+](https://maven.apache.org/) installed. 
To create a batch application project from scratch, run the following command:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=batch
```
    
{{% callout info %}}
This will invoke the generate goal of the SeedStack maven plugin [generate goal](/docs/seed/maven-plugin/generate/) which will:

* Discover the latest version of the [SeedStack reference distribution](/getting-started/distribution),
* Use its [batch archetype](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22org.seedstack%22%20a%3A%22batch-archetype%22) to generate the project.

The process is interactive and will ask you a few questions about the project to be created.
{{% /callout %}}

# Result

After execution, a single module project is created:

```plain
- myjob
    |- src
        |- main
        |   |- java
        |   |   |- org.myorg.myjob
        |   |       |- [application]    <-- application logic
        |   |       |- batch            <-- batch jobs and tasks
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

* [Batch add-on documentation](/addons/spring-bridge/batch/).
* [Simple batch job example](https://github.com/seedstack/samples/tree/master/batch).