---
title: "Reusable domain project"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTypes"
menu:
    GettingStartedProjectTypes:
        weight: 50
---

If you are using the [business framework](/docs/business) you can choose to write your domain in its own module for 
reuse and modularity purposes. In that case, each domain (e.g. each business context) should go in its own project.

# Creation

To create a reusable domain project project from scratch, execute the following command:

    mvn org.seedstack:seedstack-maven-plugin:generate-project -Dtype=domain
    
This will invoke the generate-project goal of the SeedStack maven plugin which will select the latest version
of the SeedStack distribution and use its [domain Maven archetype](http://search.maven.org/#browse%7C1573518700). 
The process is interactive and will ask you a few questions about the project to be created.

# Result

If the creation process is successful, you should see a unique module like the following:

```plain
- mydomain

    Contains a domain layer on its own. No application logic nor any infrastructure 
    should be placed here.
```
