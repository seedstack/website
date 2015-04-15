---
title: "Anatomy of a SeedStack project"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedIntroduction"
menu:
    GettingStartedIntroduction:
        weight: 20
---

A SeedStack-based project can take the form you want, however we **strongly recommend** that you to stick to the
well-supported forms described below.

# Web project (multi-module)

The recommended structure for a SEED Web project is the following:

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

# Batch project (mono-module)

The recommended structure for a SEED Batch project is the following:

```plain
- myapp-batch

    Contain the domain layer (if not in its own module), the applicative layer,
    the batch definition along with the related infrastructure and configuration.
```

# Domain project (mono-module)

If you are using the [business framework](/docs/business) you can choose to write your domain in its own module for 
reuse and modularity purposes. In that case, each domain (e.g. each business context) should go in its own project:

```plain
- mydomain1-domain
- mydomain2-domain
- ...
```

Those domains can be reused in multiple projects:

```plain
- myapp1
   - myapp-app <-- includes mydomain1-domain and mydomain2-domain
   - myapp-web

- myapp2
   - myapp-app <-- includes mydomain1-domain
   - myapp-web
``` 

# Module inner-layout

We recommend to separate the unit tests from the integration tests. For information on how to test in SEED see the
[related documentation](/docs/seed/reference/testing). 

We also expect the configuration files to be in the `META-INF/configuration` directory and your code to be in a package 
declared in the [bootstrap properties](/docs/seed/reference/core). Here is a typical module layout: 

```plain
- src
  - it  <-- for integration tests
    - java
    - resources
  - main
    - java
      - org.myorganization.myproject... 
    - resources
      - META-INF
        - seed-bootstrap.properties  <-- specify the packages to scan in this file
        - configuration  <-- location of the props files to be scanned by SEED
          - myapp.props
  - test  <-- for unit tests
    - java
    - resources
- pom.xml
```

When using the [business framework](/docs/business), you should further organize your packages by following the
[rules](/docs/business/layout).

    
