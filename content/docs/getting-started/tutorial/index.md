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
SeedStack can be used for any type of project and provides templates for several [predefined project types](../project-types).
This tutorial is focused on a **[classic Web application project](../project-types/webapp)**.
{{% /callout %}}

# Create the project

The first step is to create the Web application using the latest project template:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=web
```
    
The generator will ask you a few questions, below are the recommended answers:

* Project group id: `org.myorg`
* Project artifact id: `my-app`

This will create a `my-app` project in the current directory, with the following layout:
 
```plain
my-app       <-- root module
    |-app
    |-web
```

# First build

The just-created project is immediately buildable. Go into the root module directory (`my-app`) and run the following command:

```plain
mvn clean install
```
   
If it is the first time you build a SeedStack project on your computer, it could take a little time to download all
dependencies.

# First run

You can now run the project using the pre-configured Maven Jetty plugin. Go into the web module directory (`my-app/web`) 
directory and run the following command:
  
```plain
mvn jetty:run
```
    
If the log showed `Seed Web application started`, you can display the Web UI by pointing your Browser of choice at
[http://localhost:8080](http://localhost:8080). You can now import the project in your IDE if desired.

{{% callout info %}}
If you don't import the project in a development environment that handles the compile/deploy/run cycle, remember to 
rebuild the whole project after each modification and before restarting the jetty plugin. You can do so by:

* Killing the currently running Jetty server by hitting Ctrl-C,
* Going into the root project directory (`my-app`) and execute the `mvn clean install` command,
* Going into the web project directory (`my-app/web`) and execute the `mvn jetty:run` command.
{{% /callout %}}
