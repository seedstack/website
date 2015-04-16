---
title: "Reusable function project"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTypes"
menu:
    GettingStartedProjectTypes:
        weight: 50
---

A reusable function is a special type of project that is not intended to be run on its own but integrated into another
project, providing additional functionality. Functions can span from very basic, for instance providing only APIs, to full
stack functionality like providing UI backed by server logic and persistence.

A particularity of functions is that they can mix Web frontend static files packaged with Bower (for instance) and Java 
backend code packaged with Maven. In this case you will find a `bower.json` and a `pom.xml` file at the root of the 
project.

{{% callout info %}}
Functions can be sophisticated projects which needs to be written carefully to ensure reusability in various contexts. To
learn more about functions, check [this guide](/guides/create/reusable-function).
{{% /callout %}}

# Creation

To create a reusable function project from scratch, execute the following command:

    mvn org.seedstack.tools:seedstack-maven-plugin:scaffold-project -Dtype=function
    
This will invoke the scaffold-project goal of the SeedStack maven plugin which will select the latest version
of the SeedStack distribution and use its **function Maven archetype**. The process is interactive and will ask you a few
questions about the project to be created.

# Result

If the creation process is successful, you should see a structure similar to the following:

```plain
- myfunction

    Contains the Maven parent pom.xml and/or the bower.json descriptor.    

    - bom
        Contains a Maven BOM (pom.xml) providing dependency management 
        information for all function modules.
        
    - doc
        Contains documentation in Markdown format.
         
    - specs    
        Contains the function public API and SPI if any.
        
    - core
        Contains the function implementation if any.
        
    - rest
        Contains the function REST API if any.
        
    - static
        Contains the Web frontend static files if any.
         
    - web
        Contains the static Web files repackaged in a JAR for environments where 
        Web frontend static files are directly served by the application server. 
        Optional.
```

Note that unnecessary modules can be deleted and removed from build. 