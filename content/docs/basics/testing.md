---
title: "Testing"
type: "home"
zones:
    - "Docs"
sections:
    - "Manual"    
tags:
    - web
    - rest
    - api
menu:
    docs-manual:
        parent: "basics"
        weight: 7
---

Testing is a crucial part of application development and should not be overlooked. SeedStack can help you to test
your application by providing the necessary tools.

## Unit testing

SeedStack doesn't provide specific tools for [unit-testing](https://en.wikipedia.org/wiki/Unit_testing).
Just write your unit tests as usual.

## Integration testing

SeedStack provides several features to do [integration testing]({{< ref "docs/core/testing.md" >}}). You can do things like 
altering configuration, defining launch arguments or set system properties. This can be done either for the execution of 
a full test class, for a specific test only, or both.

{{% callout info %}}
SeedStack can support various testing frameworks but is shipping for now with support for JUnit 4, which is demonstrated
here. 
{{% /callout %}}

To test our domain service, add a `GreeterServiceIT` in the `org.generated.project.domain.services` under the 
`src/test/java` folder:

```java
package org.generated.project.domain.services;

import static org.assertj.core.api.Assertions.assertThat;

import javax.inject.Inject;
import org.generated.project.domain.model.person.Person;
import org.generated.project.domain.model.person.PersonId;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.seedstack.seed.testing.junit4.SeedITRunner;

@RunWith(SeedITRunner.class)
public class GreeterServiceIT {
    @Inject
    private GreeterService greeterService;

    @Test
    public void testGreeting() throws Exception {
        Person person = new Person(new PersonId("test@some.org"));
        person.changeName("testFirstName", "testLastName");
        assertThat(greeterService.greet(person)).isEqualTo("Hello testFirstName testLastName!");
    }
}
```

The runner:

* Starts SeedStack before executing test methods, 
* Apply the requested alterations (configuration, system properties, ...) before running each test,
* Shutdown SeedStack properly after test execution. 

{{% callout info %}}
All SeedStack features work as usual during the test. The test class itself can be injected and be the target of AOP
interception. For instance a test method can be made [transactional]({{< ref "docs/core/transactions.md" >}}).
{{% /callout %}}


## Web integration testing

If you already explored the project structure, you have probably found the `HelloResourceIT` class in the test
part of the application (`src/test/java`).

A [Web integration test]({{< ref "docs/web/testing.md" >}}) is similar to a normal integration test but uses a different
launcher to run the application. Here we will use the {{< java "org.seedstack.seed.undertow.LaunchWithUndertow" "@" >}} 
annotation on the test class to run the application with the [Undertow](http://undertow.io) embedded server.

Let's update the `HelloResourceIT` class to correspond to the current state of our application:

```java
package org.generated.project.interfaces.rest;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.response.Response;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.seedstack.seed.Configuration;
import org.seedstack.seed.testing.junit4.SeedITRunner;
import org.seedstack.seed.undertow.LaunchWithUndertow;

@RunWith(SeedITRunner.class)
@LaunchWithUndertow
public class HelloResourceIT {
    @Configuration("runtime.web.baseUrl")
    private String baseUrl;

    @Test
    public void testHelloWorld() throws Exception {
        System.out.println(baseUrl);
        Response response = given()
                .auth().basic("demo", "demo")
                .expect().statusCode(200)
                .when().get(baseUrl + "/hello");

        assertThat(response.body().asString()).isEqualTo("Hello Ella FITZGERALD!");
    }
}
```

The base URL of the application is available as the `runtime.web.baseUrl` dynamic configuration property and is retrieved with 
the {{< java "org.seedstack.seed.Configuration" "@" >}} annotation.

The test method body uses [RestAssured](http://rest-assured.io/) and [AssertJ](http://joel-costigliola.github.io/assertj/)
to do the testing job.

The test request contains basic authentication credentials, which can be of use if you uncomment the security configuration
in the `application.yaml` file.

## Now what ?

### What we learned

In this page you have learned:

* That you can write unit tests as usual without any SeedStack specificity.
* How to write a standard (non-Web) integration test.
* How to write a Web integration test.

### Troubleshooting

If you can't get this to work, check the [troubleshooting page]({{< ref "docs/troubleshooting/index.md" >}}).

### Missing accomplished!

We are done with the tutorial. Congratulations for getting this far!
{{< img src="mascot/mascot-happy.png" >}}

You can now go further and explore the [samples]({{< ref "docs/samples/index.md" >}}) or start to 
read the [core documentation]({{< ref "docs/core/index.md" >}})

