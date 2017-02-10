---
title: "Domain module"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTemplates"
menu:
    GettingStartedProjectTemplates:
        weight: 60
---

If you are using the [business framework](/docs/business) you can choose to write your domain in its own module for 
reuse and modularity purposes. In that case, each domain (e.g. each business context) should go in its own module.<!--more-->

# Creation

You need to have [Apache Maven 3.1+](https://maven.apache.org/) installed. 
To create a reusable domain project from scratch, execute the following command:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=domain
```

{{% callout info %}}
This will invoke the generate goal of the SeedStack maven plugin [generate goal](/docs/seed/maven-plugin/generate/) which will:

* Discover the latest version of the [SeedStack reference distribution](/getting-started/distribution),
* Use its [batch archetype](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22org.seedstack%22%20a%3A%22domain-archetype%22) to generate the project.

The process is interactive and will ask you a few questions about the project to be created.
{{% /callout %}}

# Result

After execution, a single module project is created which contains only the domain layer. This module is intended to be
included in other modules such as a [Web application](../web), a [REST service](../rest) or a [Batch job](../batch).

You should see a structure similar to the following:

```plain
- mydomain
    |- src
        |- main
        |   |- java
        |   |   |- org.myorg.mydomain
        |   |       |- model            <-- domain model
        |   |       |- services         <-- domain services
        |   |- resources
        |       |- META-INF
        |           |- configuration    <-- main configuration
        |- test
            |- java
            |- resources
                |- META-INF
                    |- configuration    <-- test configuration
```

# More resources

* [Business framework documentation](/docs/business).
* [Simple business example](https://github.com/seedstack/samples/tree/master/business).