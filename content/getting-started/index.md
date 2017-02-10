---
title: "Quick start"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedQuickStart"
menu:
    GettingStartedQuickStart:
        weight: 10
---

**SeedStack is an opinionated, easy-to-use Java development stack.** It is a general purpose development solution which
can be used to address various project types with a particular focus on REST microservices and applications.
 
# Start from scratch

The easiest way to get started with SeedStack is to use the project generator:
 
    mvn org.seedstack:seedstack-maven-plugin:generate
    
The SeedStack maven plugin will ask you a small number of questions, starting with the [type of project](project-templates) you want to create.

## Run from the command-line
    
To launch the project from the command-line, just use the `run` goal of the SeedStack Maven plugin:
 
    mvn org.seedstack:seedstack-maven-plugin:run
    
This will launch the `org.seedstack.seed.core.SeedMain` main class.
        
## Run from your IDE
        
To launch the project from your IDE, just define a plain "Java application" running configuration targeting the 
`org.seedstack.seed.core.SeedMain` main class.


# Follow the tutorial

Learn about SeedStack by following the tutorial. It is based upon an very simple e-commerce use case and will walk you through 
the essentials of a project.

{{< button href="tutorial" icon="fa fa-graduation-cap" label="Follow the tutorial!" >}}

# Get the samples

We provide several samples demonstrating various aspects of SeedStack. 

{{< button href="samples" icon="fa fa-file-text-o" label="Get the samples!" >}}

# Integration into an existing project

You can choose to integrate SeedStack in an existing project by including the following dependency management snippet in
your Maven project POM:

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.seedstack</groupId>
                <artifactId>seedstack-bom</artifactId>
                <version>16.11.1</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        <dependencies>
    <dependencyManagement>

To make a working SeedStack project you need to add an artifact containing a runtime environment. 
You can try the `seed-web-undertow` artifact, containing the [Undertow embedded Web server](http://undertow.io):
 
{{< dependency g="org.seedstack.seed" a="seed-web-undertow" >}}
    