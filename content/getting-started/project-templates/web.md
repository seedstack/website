---
title: "Web application"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTemplates"
tags:
    - onboarding
    - web
menu:
    GettingStartedProjectTemplates:
        weight: 30
---

A REST-oriented micro-service or application. You can choose to add a W20 UI during generation. <!--more-->

The result is a single-JAR [capsule](http://www.capsule.io) embedding the [Undertow](http://undertow.io) Web server.
If you select the W20 UI option during generation, it also includes the [W20 bridge add-on]({{< ref "addons/w20-bridge/index.md" >}}) 
which automatically manages the W20 frontend.

# Creation

You need to have [Apache Maven 3.1+](https://maven.apache.org/) installed. 
To create a Java Web application project from scratch, execute the following command:

```bash
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=web
```

{{% callout info %}}
This will invoke the generate goal of the SeedStack maven plugin [generate goal]({{< ref "docs/maven-plugin/manual/generate.md" >}}) which will:

* Discover the latest version of the [SeedStack reference distribution]({{< ref "docs/overview/distribution.md" >}}),
* Use its [web archetype](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22org.seedstack%22%20a%3A%22web-archetype%22) to generate the project.

The process is interactive and will ask you a few questions about the project to be created.
{{% /callout %}}

# Result
 
After execution, a single module project is created:

```plain
- myservice
    |- src
        |- main
        |   |- docker                         <-- docker file if any
        |   |- java
        |   |   |- org.generated.project
        |   |       |- application            <-- application logic
        |   |       |- domain
        |   |       |   |- model              <-- domain model
        |   |       |   |- services           <-- domain services
        |   |       |   |- shared             <-- shared value objects
        |   |       |- infrastructure         <-- technical infrastructure
        |   |       |- interfaces       
        |   |           |- rest               <-- REST resources and representations
        |   |- resources
        |       |- application.yaml           <-- main configuration
        |       |- META-INF
        |           |- [resources]            <-- frontend static resources if any
        |- test
            |- java
            |- resources
                |- application.override.yaml  <-- test configuration
```

{{% callout info %}}
Note that you can choose to remove the domain packages and put the domain in a [separate domain module]({{< ref "getting-started/project-templates/domain.md" >}}).
{{% /callout %}}

# Conversion to WAR

This project is designed to be run from the command-line with its embedded Web server. To convert it to a classic WAR,
see [this guide]({{< ref "guides/conversion-to-war/index.md" >}}).
        

# More resources

* [W20 documentation](https://w20-framework.github.io)
* [Web documentation]({{< ref "docs/seed/manual/web.md" >}}).
* [W20 bridge add-on documentation]({{< ref "addons/w20-bridge/index.md" >}}).
* [Simple Web application example](https://github.com/seedstack/store-webapp-sample).
