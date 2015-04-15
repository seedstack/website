---
title: "Create a Java Web application"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedCreation"
menu:
    GettingStartedCreation:
        weight: 20
---

...

# Creation

...

# Result
 
If the creation process is successful, you should see a structure similar to the following:

```plain
- myapp

    Maven parent project used to regroup common pom.xml configuration.
    All dependency management should go here.

  - myapp-app

    Contains the domain (if not in its own module), the application logic
    along with the related infrastructure and configuration.

  - myapp-web

    Contains the Web interfaces code (REST resources, representations). May
    contain multiple interfaces (REST API + Web Services for instance).
    May contain additional resources needed by those interfaces (like static
    Web resources).
```