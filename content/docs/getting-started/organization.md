---
title: "Anatomy of a SEED project"
zones:
    - "Seed"
sections:
    - "GettingStartedIntroduction"
menu:
    GettingStartedOrganization:
        weight: 20
---

A SEED-based project can take the form you want, however we **strongly recommend** that you to stick to the
well-supported forms described below.

# Web project (multi-module)

The recommended structure for a SEED Web project is the following:

    - myapp

        Maven parent project used to regroup common pom.xml configuration.
        All dependency management should go here.

      - myapp-app

        Contains the domain layer (if not in its own module), the
        applicative layer along with the related infrastructure and configuration.

      - myapp-web

        Contains the interface layer code (REST resources, representations). May
        contain multiple interfaces (interactive Web + Web services for instance).
        May contain additional resources needed by those interfaces (like static
        Web resources).

# Batch project (mono-module)

The recommended structure for a SEED Batch project is the following:

    - myapp-batch

        Contain the domain layer (if not in its own module), the applicative layer,
        the batch definition along with the related infrastructure and configuration.

# Domain project (mono-module)

You can choose to split your domain into its own project for reuse and modularity purposes.
In that case, each domain (each business context) should go in its own project:

    - mydomain1-domain
    - mydomain2-domain
    - ...

Those domains can be reused in multiple projects:

    - myapp1
       - myapp-app <-- includes mydomain1-domain and mydomain2-domain
       - myapp-web
    
    - myapp2
       - myapp-app <-- includes mydomain1-domain
       - myapp-web


# Module inner organization

We recommend to separate the unit tests from the integration
tests. For information on how to test in SEED see the
[related documentation](#!/seed-doc/test). We also expect the
configuration files to be in the `META-INF/configuration` directory
and your code to be in a package starting by `com.inetpsa`. This
requirements are more detailed in the [Core documentation](#!/seed-doc/core). 

    - src
      - it  <-- for integration tests
        - ...
      - main
        - java
          - com.inetpsa.myproject... 
        - resources
          - META-INF
            - configuration  <-- location of the props files to be scanned by SEED
              - myapp.props
      - test  <-- for unit tests
        - ...
    - pom.xml

When using the business framework, you should further organize your packages by following its rules for each layer:

- [domain layer organization](#!/business-doc/hands-on-domain#package-organisation)
- [application layer organization](#!/business-doc/hands-on-application#package-organisation)
- [interfaces layer organization](#!/business-doc/hands-on-interfaces#package-organisation)

    
