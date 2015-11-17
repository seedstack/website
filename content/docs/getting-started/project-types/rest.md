---
title: "Java RESTful project"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTypes"
menu:
    GettingStartedProjectTypes:
        weight: 30
---

A Java RESTful project is a minimalist mono-module project which produces a WAR artifact. It can rely on one or more
[reusable domains](../domain) and/or embed its own business logic. This type of project is intended for lightweight
RESTful projects like micro-services. 

# Creation

To create a Java RESTful project from scratch, execute the following command:

    mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=rest
    
This will invoke the generate goal of the SeedStack maven plugin which will select the latest version
of the SeedStack distribution and use its [REST Maven archetype](http://search.maven.org/#browse%7C-1094006884). 
The process is interactive and will ask you a few questions about the project to be created.

# Result
 
If the creation process is successful, you should see a unique module like the following:

```plain
- myservice

    Contains the REST APIs and optionally the business logic behind them. This logic
    is often offloaded in reusable domain(s).
```