---
title: "Project templates"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTemplates"
tags:
    - onboarding
menu:
    GettingStartedProjectTemplates:
        weight: 10
noToc: true        
---

SeedStack provides a number of predefined project templates that can be generated from [Maven archetypes](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html).<!--more--> 

We recommend that you use these project templates, especially if you are new to SeedStack as they provide several benefits:

* They are immediately executable and deployable after generation,
* They follow best practices, providing clean code organization and good modularity,
* They are easy to use and provide fast onboarding.

# REST micro-service

A lightweight micro-service template for publishing a REST API in a single-JAR [capsule](http://www.capsule.io) embedding the 
[Undertow](http://undertow.io) Web server.

```bash
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=rest
```

**[Learn more...]({{< ref "getting-started/project-templates/rest.md" >}})**  

# Classic Web application

A classic Java Web application project mixing backend Java classes and frontend static resources. This projects uses
the [W20 framework](http://w20-framework.github.io) to provide a sample UI, but you can easily change it.
 
```bash
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=web
```
 
**[Learn more...]({{< ref "getting-started/project-templates/web.md" >}})**  

# Command-line application

A command-line (CLI) application that can provide multiple commands in a single-JAR [capsule](http://www.capsule.io).

```bash
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=cli
```

**[Learn more...]({{< ref "getting-started/project-templates/cli.md" >}})**  

# Business domain module

A reusable JAR designed to contain one or more business domain(s) based on the [business framework]({{< ref "docs/business/index.md" >}}).

```bash
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=domain
```

**[Learn more...]({{< ref "getting-started/project-templates/domain.md" >}})**  

# Batch application

An application to run batch jobs in a single-JAR [capsule](http://www.capsule.io).

```bash
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=batch
```

**[Learn more...]({{< ref "getting-started/project-templates/batch.md" >}})**  
