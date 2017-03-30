---
title: "Testing"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
tags:
    - testing
menu:
    SeedManual:
        weight: 99
---

The `seed-testing` module provide tools for testing your code.<!--more--> SeedStack testing tools are based upon the 
popular [JUnit](http://junit.org/) testing framework and [Arquillian](http://arquillian.org/) for Web tests. 

# Dependency

Testing support requires the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-testing" s="test" >}}

{{% callout warning %}}
Be sure to specify the `test` scope for this dependency.
{{% /callout %}}

# Unit tests

The purpose of unit tests is to take a small and testable part of a program, isolate it from any dependency (injection, 
databases, network, file system, ...) by mocking them and check whether it behaves exactly as expected. The main goal is 
to validate code quality and reliability. 

SeedStack doesn't go beyond providing basic but useful test libraries:
 
* [AssertJ](http://joel-costigliola.github.io/assertj/), 
* [Mockito](http://mockito.org/).

# Integration tests

The purpose of integration tests is to pick multiple components at once and test them as a whole. Integration tests can 
range from a testing a simple operation involving two classes to an entire application setup with all its dependencies 
(databases, file system, network, ...). 

Their main goal is to detect issues appearing when components interact with each other. Integration tests can be 
used to validate technical behavior, such as the correct operation of a group of components, or can extend beyond to verify 
the global program behavior in regard to functional expectations.

## Simple integration tests

When a Web server is not required for testing, use the {{< java "org.seedstack.seed.it.SeedITRunner" >}} 
JUnit runner by applying the {{< java "org.junit.runner.RunWith" "@" >}} annotation on your test class:

```java
@RunWith(SeedITRunner.class)
public class SomeIT {
    @Inject
    private MyService myService;

    @Test
    public void myServiceIsInjectable() {
        Assertions.assertThat(myService).isNotNull();
    }		
}
```

{{% callout tips %}}
Note that you can also extend the {{< java "org.seedstack.seed.it.AbstractSeedIT" >}} class which has the same effect as
using the `@RunWith` annotation.
{{% /callout %}}
	
The runner will do these operations in order:

1. The static method annotated with {{< java "org.seedstack.seed.it.BeforeKernel" "@" >}} is executed if any.
2. SeedStack is started.
3. The static method annotated with {{< java "org.junit.BeforeClass" "@" >}} is executed if any.
4. The test class is instantiated by the injector which makes it **injectable and interceptable**.
5. The test method annotated with {{< java "org.junit.Before" >}} is executed if any.
6. The test method is executed.
7. The test method annotated with {{< java "org.junit.After" >}} is executed if any.
8. Steps 4 to 7 are repeated for each test method. **This means that each test is done on a different instance of the test class.**
9. The static method annotated with {{< java "org.junit.AfterClass" "@" >}} is executed if any.
10. SeedStack is stopped.
11. The static method annotated with {{< java "org.seedstack.seed.it.AfterKernel" "@" >}} is executed if any.

{{% callout tips %}}
Simple integration tests run faster than Web integration tests are simpler to maintain. They should be preferred when 
Web testing is not necessary and be supplemented with the minimal amount of Web integration tests.
{{% /callout %}}

# Web integration tests
	
SeedStack uses [Arquillian](http://arquillian.org/) to do Web testing. These kind of integration tests allow to 
programmatically define the Web archive (WAR) and test it either from server-side or from client-side. 

To use arquillian, add the following dependency:

{{< dependency g="org.seedstack.poms" a="arquillian-composite" s="test" t="pom" >}}

Then use the {{< java "org.jboss.arquillian.junit.Arquillian" >}} JUnit runner by applying the {{< java "org.junit.runner.RunWith" "@" >}} 
annotation on your test:
 
```java
@RunWith(Arquillian.class)
public class RestIT {
    @Inject
    private MyService myService; 

    @Deployment
    public static WebArchive createDeployment() {
        // You can use this method to customize the deployed archive
        return ShrinkWrap.create(WebArchive.class);
    }
    
    @Test
    public void myServiceIsInjectable() {
        Assertions.assertThat(myService).isNotNull();
    }
    
    @Test
    @RunAsClient
    public void myRestResourceIsWorking(@ArquillianResource URL baseURL) {
        expect().statusCode(200).when().get(baseURL.toString() + "rest/my-resource");
    }		
}
```

{{% callout tips %}}
Note that you can also extend the {{< java "org.seedstack.seed.it.AbstractSeedWebIT" >}} class which has the same effect as
using the `@RunWith` annotation.
{{% /callout %}}

{{% callout warning %}}
The test class is instantiated by Arquillian and as such cannot be intercepted. It can still be injected. 
{{% /callout %}}

In this example:

* The first test method, named `myServiceIsInjectable`, is a server-side test. It can test if injected dependencies,
like a service of the Web application here, are working correctly. 
* The second test method, named `myRestResourceIsWorking`, is a client-side test. It is executed in a separate 
thread and can invoke the deployed Web application through the URL provided by the {{< java "org.jboss.arquillian.test.api.ArquillianResource" "@" >}} 
annotated parameter. 

{{% callout info %}}
[Apache Tomcat](http://tomcat.apache.org/) is the default test server configured. You can override this choice by specifying
a custom `arquillian.xml` file at the root of the classpath. Arquillian provides many more features than described in
this section. For more information about Arquillian, visit the [official website](http://arquillian.org/). 
{{% /callout %}}

# Multiple test folders

You may want to separate integration tests and unit tests into different source folders. If you use Maven your can
do so by adding the following configuration to your project root `pom.xml`:

```xml
<build>
  <testResources>
    <testResource>
      <directory>src/it/resources</directory>
    </testResource>
    <testResource>
      <directory>src/test/resources</directory>
    </testResource>
  </testResources>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-failsafe-plugin</artifactId>
      <version>...</version>
      <executions>
        <execution>
          <id>execute-integration-tests</id>
          <phase>integration-test</phase>
          <goals>
            <goal>integration-test</goal>
          </goals>
        </execution>
        <execution>
          <id>verify-integration-tests</id>
          <phase>verify</phase>
          <goals>
            <goal>verify</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
    <plugin>
      <groupId>org.codehaus.mojo</groupId>
      <artifactId>build-helper-maven-plugin</artifactId>
      <version>...</version>
      <executions>
        <execution>
          <id>add-it-sources</id>
          <phase>generate-test-sources</phase>
          <goals>
            <goal>add-test-source</goal>
          </goals>
          <configuration>
            <sources>
              <source>src/it/java</source>
            </sources>
          </configuration>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```