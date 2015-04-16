---
title: "Java batch project"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTypes"
menu:
    GettingStartedProjectTypes:
        weight: 30
---

...

# Creation

To create a Java batch project project from scratch, execute the following command:

    mvn org.seedstack.tools:seedstack-maven-plugin:scaffold-project -Dtype=batch
    
This will invoke the scaffold-project goal of the SeedStack maven plugin which will select the latest version
of the SeedStack distribution and use its **batch Maven archetype**. The process is interactive and will ask you a few
questions about the project to be created.

# Result

If the creation process is successful, you should see a unique module similar to the following:

```plain
- myapp-batch

    Contain the domain layer (if not in its own module), the applicative layer,
    the batch definition along with the related infrastructure and configuration.
```
