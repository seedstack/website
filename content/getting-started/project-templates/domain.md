---
title: "Domain module (reusable)"
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
reuse and modularity purposes. In that case, each domain (e.g. each business context) should go in its own module.

# Creation

To create a reusable domain project from scratch, execute the following command:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=domain
```

This will invoke the generate goal of the SeedStack maven plugin which will select the latest version
of the SeedStack distribution and use its [domain Maven archetype](http://search.maven.org/#browse%7C1573518700). 
The process is interactive and will ask you a few questions about the project to be created.

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