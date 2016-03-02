---
title: "Tutorial"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedTutorial"
menu:
    GettingStartedTutorial:
        weight: 10
---

Welcome to the SeedStack 15-minutes tutorial! It is intended to walk you through the most interesting features
of SeedStack, by making you build a simple Web application from scratch.

{{% callout info %}}
SeedStack can be used for any type of project and provides templates for several [predefined project types](../project-templates).
This tutorial is focused on a **[Web application project](../project-templates/web)**.
{{% /callout %}}

# Create the project

The first step is to create the Web application using the latest project template:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=web
```
    
The generator will ask you a few questions, below are the recommended answers:

* Project group id: `org.myorg`
* Project artifact id: `my-app`

This will create a `my-app` project in the current directory.
 
# First build

The just-created project is immediately buildable. Go into the root module directory (`my-app`) and run the following command:

```plain
mvn clean install
```

{{% callout info %}}
If it is the first time you build a SeedStack project on your computer, it could take a little time to download all
dependencies.
{{% /callout %}}

# First run

You can now run the project using the pre-configured Maven Jetty plugin. Go into the web module directory (`my-app/web`) 
directory and run the following command:
  
```plain
mvn org.seedstack:seedstack-maven-plugin:run
```
    
When the log shows `Seed Web application started`, you can display the Web UI by pointing your Browser of choice at
[http://localhost:8080](http://localhost:8080). You can now import the project in your IDE if desired.

