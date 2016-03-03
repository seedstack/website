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
automatically manages the W20 frontend.

# Creation

To create a Java Web application project from scratch, execute the following command:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=web
```

This will invoke the generate goal of the SeedStack maven plugin which will select the latest version
of the SeedStack distribution and use its [Web Maven archetype](http://search.maven.org/#browse%7C1221480962).
The process is interactive and will ask you a few questions about the project to be created.

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
3. Configure the `maven-war-plugin` to ignore the absence of the `web.xml` file.

For the last step you can use the following POM snippet:

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

# More resources

* [W20 documentation](/docs/w20).
* [Web documentation](/docs/seed/manual/web).
* [W20 bridge add-on documentation](/addons/w20-bridge).
* [Simple Web application example](https://github.com/seedstack/store-webapp-sample).
