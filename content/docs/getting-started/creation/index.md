---
title: "Overview"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedCreation"
menu:
    GettingStartedCreation:
        weight: 10
---

SeedStack can be used to develop any type of project with almost any structure but several predefined types can be 
easily generated. Moreover, these predefined types guarantee you a clean organization of your code and good modularity
so stick to them when possible.

* [Java Web applications](creation/webapp) which are packaged as a WAR file,   
* [Batch jobs](creation/batch) which are packaged as an executable JAR file,
* [Reusable business domains](creation/domain) which are packaged as a JAR file,
* [Reusable functions](creation/function) which are packaged as multiple JAR files and/or static files,
* [Browser-only single page applications](creation/w20) which are static files. 

# Inner structure for Java modules

The following structure is recommended for all Java modules:

```plain
- src

  - it  <-- for integration tests if any
    - java
    - resources
    
  - main
    - java
      - org.myorganization... 
    - resources
      - META-INF
        - configuration  <-- location of the module configuration files if any
          - ...
          
  - test  <-- for unit tests
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
You can learn more about fragments [here](/docs/w20/concepts/fragment). 
{{% /callout %}}