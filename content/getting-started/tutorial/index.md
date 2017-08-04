---
title: "Tutorial"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedTutorial"
tags:
    - onboarding
    - maven
menu:
    GettingStartedTutorial:
        weight: 10
---

Welcome to the SeedStack tutorial! It is intended to walk you through the most interesting features of SeedStack, by 
making you build a simple Web application from scratch.<!--more-->

{{% callout info %}}
SeedStack can be used for any type of project and provides templates for several [predefined project types]({{< ref "getting-started/project-templates/index.md" >}}).
This tutorial is focused on a **[Web project template]({{< ref "getting-started/project-templates/web.md" >}})**.
{{% /callout %}}

# Project generation

The first step is to create the Web application using the latest project template:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate
```
    
The generator will ask you a few questions, below are the recommended answers:

* Project type: `web`,
* Project group id: `org.myorg.myapp`,
* Project artifact id: `my-app`.

This will create the project in the `my-app` subdirectory of the current directory.
 
# First build

The project is immediately buildable. Go into the project directory and run the following command:

```plain
mvn clean install
```

{{% callout info %}}
The build process will create a [Capsule](http://capsule.io) of the project. A capsule is a standalone JAR containing
all the files and dependencies of the project. The capsule can be launched with:

```plain
java -jar target/my-app-1.0.0-SNAPSHOT-capsule.jar
```    
{{% /callout %}}

# First run

In development you can run the application without building the capsule:
  
```plain
mvn seedstack:run
```
    
When the application has started, you can display the Web UI by pointing your Browser of choice at
[http://localhost:8080](http://localhost:8080). You can now import the project in your IDE if desired.

# Displaying configuration options
 
You can display all configuration options of your SeedStack project by running:

```plain
mvn org.seedstack:seedstack-maven-plugin:config
```

If you want more information about a particular option:
 
```plain
mvn org.seedstack:seedstack-maven-plugin:config name.of.option
```
