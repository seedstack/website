---
title: "Project types"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTemplates"
menu:
    GettingStartedProjectTemplates:
        weight: 10
---

SeedStack-based projects can be created from scratch but we propose a number of predefined project templates in the SeedStack
reference distribution that can be generated from [Maven archetypes](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html)
or [Yeoman generators](http://yeoman.io/).<!--more--> We recommend that you use these project templates, especially if you are
new to SeedStack as they provide several benefits:

* They are immediately executable and deployable after generation,
* They follow best practices, providing clean code organization and good modularity,
* They are easy to use and provide fast onboarding.

# Reference project templates

The following project templates are available from the reference distribution:

* [Web application](web) template (backend + frontend),
* [RESTful micro-service](rest) template (backend only),
* [Command-line application](cli) template (backend only),
* [Batch job](batch) template (backend only),
* [Reusable business domain](domain) template (reusable backend component),
* [W20 Single Page Application](w20) template (frontend only).

{{% callout info %}}
Note that SeedStack is designed with extension in mind so you can design your own project types and provide archetypes
and code generators for them in a [custom distribution](../distribution/create-your-own).
{{% /callout %}}

# Project structure

Each project template has its own layout, adapted to the

## Java modules

When creating a project from a reference template, the
The following directory structure is recommended for all Java modules:

```plain
- src

  - main
    - java
      - org.myorganization... 
    - resources
      - META-INF
        - configuration  <-- location of the module configuration files if any
          - ...
          
  - test  <-- for unit (*Test) and integration (*IT) tests
    - java
    - resources
    
- pom.xml
```

# Inner structure of Web fragments

Browser-only Web application are based upon the notion of "W20 fragments" which regroups various resources needed to provide
one or more feature(s). The following structure is recommended for all W20 fragments:

```plain
- i18n                  <-- Localization files if any
- modules               <-- JS modules
- templates             <-- HTML templates
                        
- specs                 <-- Tests
- mocks                 <-- Mocks for tests

- my-fragment.w20.json  <-- fragment manifest 
```

{{% callout info %}}
You can learn more about fragments [here](/docs/w20/manual).
{{% /callout %}}
