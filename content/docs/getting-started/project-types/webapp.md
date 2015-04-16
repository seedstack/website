---
title: "Java Web application project"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTypes"
menu:
    GettingStartedProjectTypes:
        weight: 20
---

A Java Web application project is a typical WAR-style project. It has an application module of JAR type, containing 
application logic and possibly business domain logic if not separated to another module. It also has a Web module of
WAR type, containing Web-related code. It is deployed as a standard WAR. 

# Creation

To create a Java Web application project from scratch, execute the following command:

    mvn org.seedstack.tools:seedstack-maven-plugin:scaffold-project -Dtype=web
    
This will invoke the scaffold-project goal of the SeedStack maven plugin which will select the latest version
of the SeedStack distribution and use its **Web Maven archetype**. The process is interactive and will ask you a few
questions about the project to be created.

# Result
 
If the creation process is successful, you should see a structure similar to the following:

```plain
- myapp

    Maven parent module used to regroup common pom.xml configuration.
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