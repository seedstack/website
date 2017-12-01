---
title: "Testing"
type: "home"
zones:
    - "Docs"
tags:
    - web
    - rest
    - api
menu:
    docs:
        parent: "basics"
        weight: 7
---

Testing is a crucial part of application development and should not be overlooked. SeedStack can help you to test
your application by providing the necessary tools.

## Unit testing

SeedStack doesn't provide specific tools for [Unit-testing](https://en.wikipedia.org/wiki/Unit_testing). 

It only provides useful testing libraries like [JUnit 4](http://junit.org/junit4/), [AssertJ](http://joel-costigliola.github.io/assertj/) and [Mockito](http://site.mockito.org/).

## Integration testing

You can do [integration testing]({{< ref "docs/core/testing.md" >}}) on **non-Web parts of the application** by making 
your test class extend the {{< java "org.seedstack.seed.it.AbstractSeedIT" >}} class. 

Add a `GreeterServiceIT` in the `org.generated.project.domain.services` under the `src/test/java` folder:

```java
package org.generated.project.domain.services;

import static org.assertj.core.api.Assertions.assertThat;

import javax.inject.Inject;
import org.generated.project.domain.model.person.Person;
import org.generated.project.domain.model.person.PersonId;
import org.junit.Test;
import org.seedstack.seed.it.AbstractSeedIT;

public class GreeterServiceIT extends AbstractSeedIT {
    @Inject
    private GreeterService greeterService;

    @Test
    public void testGreeting() throws Exception {
        Person person = new Person(new PersonId("test@som.org"));
        person.changeName("testFirstName", "testLastName");
        assertThat(greeterService.greet(person)).isEqualTo("Hello testFirstName testLastName!");
    }
}
```

The runner starts SeedStack before executing test methods and then shutdown SeedStack properly. 

{{% callout info %}}
All SeedStack features work as usual during the test. The test class itself can be injected and be the target of AOP
interception. For instance a test method can be made [transactional]({{< ref "docs/core/transactions.md" >}}).
{{% /callout %}}


## Web integration testing

If you already explored the project structure, you have probably found the `HelloResourceIT` class in the test
part of the application (`src/test/java`).

This is a [Web integration test]({{< ref "docs/web/testing.md" >}}) that uses [Arquillian](http://arquillian.org/) to
execute the Web application and validate some assertions on its REST API.

{{% callout info %}}
In SeedStack, by default, Arquillian is configured to use an embedded version of Tomcat on port 9090.
{{% /callout %}}


Let's update the `HelloResourceIT` class to correspond to the current state of our application:

```java
package org.generated.project.interfaces.rest;

import io.restassured.response.Response;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Test;
import org.seedstack.seed.it.AbstractSeedWebIT;

import java.net.URL;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

public class HelloResourceIT extends AbstractSeedWebIT {
    @ArquillianResource
    private URL baseURL;

    @Deployment
    public static WebArchive createDeployment() {
        return ShrinkWrap.create(WebArchive.class);
    }

    @Test
    @RunAsClient
    public void testHelloWorld() throws Exception {
        Response response = given()
                .auth().basic("demo", "demo")
                .expect().statusCode(200)
                .when().get(baseURL + "hello");

        assertThat(response.body().asString()).isEqualTo("Hello Ella FITZGERALD!");
    }
}
```

### Tested WebApp

The test class extends {{< java "org.seedstack.seed.it.AbstractSeedWebIT" >}} which has the effect of running the test
with Arquillian.

The Web archive (WAR) is programmatically created in the `createDeployment()` static method. It can be customized by adding
classes, resources and metadata using the [ShrinkWrap API](http://arquillian.org/guides/shrinkwrap_introduction/). This is
handy for testing alternatives of the application.

The base URL of the application (which is randomized) is injected by Arquillian using the
 {{< java "org.jboss.arquillian.test.api.ArquillianResource" "@" >}} annotation.

### Test method

The test method is annotated by {{< java "org.jboss.arquillian.container.test.api.RunAsClient" "@" >}} which make it
run in a separate thread that can invoke the WebApp from the outside.

The test method body uses [RestAssured](http://rest-assured.io/) and [AssertJ](http://joel-costigliola.github.io/assertj/)
to do the testing job.

{{% callout tips %}}
The test request contains basic authentication credentials, which can be of use if you uncomment the security configuration
in the `application.yaml` file.
{{% /callout %}}

## Now what ?

### What we learned

In this page you have learned:

* That you can write Unit tests as usual without any SeedStack specificity.
* How to write a standard (non-Web) integration test.
* How to write a Web integration test.

### Troubleshooting

If you can't get this to work, check the [troubleshooting page]({{< ref "docs/basics/troubleshooting.md" >}}).

### Missing accomplished!

We are done with the tutorial. Congratulations for getting this far!
{{< img src="mascot/mascot-happy.png" >}}

You can now go further and explore the [samples]({{< ref "docs/basics/samples.md" >}}) or start to 
read the [reference documentation]({{< ref "docs/core/index.md" >}})

