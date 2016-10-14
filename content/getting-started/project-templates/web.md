---
title: "Web application"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTemplates"
menu:
    GettingStartedProjectTemplates:
        weight: 20
---

A Java Web application project is a JAR module embedding the Undertow Web server. It is intended to contain backend
Java classes as well as frontend W20 static resources. It also includes the [W20 bridge add-on](/addons/w20-bridge) which
automatically manages the W20 frontend.<!--more-->

# Creation

You need to have [Apache Maven 3.1+](https://maven.apache.org/) installed. 
To create a Java Web application project from scratch, execute the following command:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=web
```

{{% callout info %}}
This will invoke the generate goal of the SeedStack maven plugin [generate goal](/docs/seed/maven-plugin/generate/) which will:

* Discover the latest version of the [SeedStack reference distribution](/getting-started/distribution),
* Use its [web archetype](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22org.seedstack%22%20a%3A%22web-archetype%22) to generate the project.

The process is interactive and will ask you a few questions about the project to be created.
{{% /callout %}}

# Result
 
After execution, a single module project is created:

```plain
- myservice
    |- src
        |- main
        |   |- java
        |   |   |- org.myorg.myservice
        |   |       |- [application]    <-- application logic
        |   |       |- [domain]
        |   |       |   |- [model]      <-- domain model
        |   |       |   |- [services]   <-- domain services
        |   |       |- [infrastructure] <-- technical infrastructure
        |   |       |- rest             <-- REST resources and representations
        |   |- resources
        |       |- META-INF
        |           |- configuration    <-- main configuration
        |           |- [resources]      <-- frontend static resources
        |- test
            |- java
            |- resources
                |- META-INF
                    |- configuration    <-- test configuration
```

{{% callout info %}}
Note that the directory in brackets are not created by the archetype. They are the recommended locations if you need
to add any business domain or static resources to your project. You can also choose to put the domain in a separate [domain module](../domain).
{{% /callout %}}

# Conversion to WAR

The resulting project can be easily converted to a traditional WAR:

1. Add a `src/main/webapp` folder to hold the document root,
2. Add a `<packaging>WAR</packaging>` tag to the `pom.xml`,
3. Remove the `build-capsule` plugin execution (`package` goal of `seedstack-maven-plugin`) as this only works with standalone JAR files,
4. Configure the `maven-war-plugin` to ignore the absence of the `web.xml` file:

        <build>
             <pluginManagement>
                 <plugins>
                     <plugin>
                         <groupId>org.apache.maven.plugins</groupId>
                         <artifactId>maven-war-plugin</artifactId>
                         <configuration>
                             <failOnMissingWebXml>false</failOnMissingWebXml>
                         </configuration>
                     </plugin>
                 </plugins>
             </pluginManagement>
         </build>
         
5. Exclude the embedded Web server from the Web composite:

        <dependency>
            <groupId>org.seedstack</groupId>
            <artifactId>web-composite</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>org.seedstack.seed</groupId>
                    <artifactId>seed-web-undertow</artifactId>
                </exclusion>
            </exclusions>
        <dependency>
        

# More resources

* [W20 documentation](/docs/w20).
* [Web documentation](/docs/seed/manual/web).
* [W20 bridge add-on documentation](/addons/w20-bridge).
* [Simple Web application example](https://github.com/seedstack/store-webapp-sample).
