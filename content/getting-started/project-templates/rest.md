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

You need to have [Apache Maven 3.1+](https://maven.apache.org/) installed. 
To create a REST micro-service project from scratch, run the following command:

```plain
mvn org.seedstack:seedstack-maven-plugin:generate -Dtype=rest
```

{{% callout info %}}
This will invoke the generate goal of the SeedStack maven plugin [generate goal](/docs/seed/maven-plugin/generate/) which will:

* Discover the latest version of the [SeedStack reference distribution](/getting-started/distribution),
* Use its [batch archetype](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22org.seedstack%22%20a%3A%22rest-archetype%22) to generate the project.

The process is interactive and will ask you a few questions about the project to be created.
{{% /callout %}}

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

