---
title: "REST micro-service"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedProjectTemplates"
menu:
    GettingStartedProjectTemplates:
        weight: 30
---

A REST micro-service project is an executable JAR module embedding the Undertow Web server. It is intended to only contain
backend Java classes to provide a REST API. It is the ideal template for lightweight REST micro-services.

# Creation

To create a REST micro-service project from scratch, run the following command:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=rest
```

This will invoke the generate goal of the SeedStack maven plugin which will select the latest version
of the SeedStack distribution and use its [REST Maven archetype](http://search.maven.org/#browse%7C-1094006884).
The process is interactive and will ask you a few questions about the project to be created.

# Result

After execution, a single module project is created:

```plain
- myapp
    |- src
        |- main
        |   |- java
        |   |   |- org.myorg.myapp
        |   |       |- [application]    <-- application logic
        |   |       |- [domain]
        |   |       |   |- [model]      <-- domain model
        |   |       |   |- [services]   <-- domain services
        |   |       |- [infrastructure] <-- technical infrastructure
        |   |       |- rest             <-- REST resources and representations
        |   |- resources
        |       |- META-INF
        |           |- configuration    <-- main configuration
        |- test
            |- java
            |- resources
                |- META-INF
                    |- configuration    <-- test configuration
```

{{% callout info %}}
Note that the directory in brackets are not created by the archetype. They are the recommended locations if you need
to add any business domain to your project. You can also choose to put the domain in a separate [domain module](../domain).
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

* [REST documentation](/docs/seed/manual/rest).
* [Simple REST micro-service example](https://github.com/seedstack/catalog-microservice-sample).

