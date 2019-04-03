---
title: "Web integration testing"
type: "home"
zones:
    - "Docs"
sections:
    - "Manual"    
tags:
    - tutorial
    - testing
menu:
    docs-manual:
        parent: "web"
        weight: 2
---

SeedStack provides support to do integration testing of Web applications.<!--more-->

## Using a Web launcher

A SeedStack Web integration test is a [normal integration test]({{< ref "docs/core/testing.md" >}}) with its default
launcher swapped to a Web-oriented launcher. 

SeedStack provides a launcher based on the [Undertow](http://undertow.io) embedded server in the `seed-web-undertow`.
In addition the dependency used for normal testing (like `seed-testing-junit4`), add the following dependency:

{{< dependency g="org.seedstack.seed" a="seed-web-undertow" s="test" >}}  

As an example, consider the following Web integration test:

```java
@RunWith(SeedITRunner.class)
@LaunchWithUndertow
public class SomeWebIT {
    @Configuration("runtime.web.baseUrl")
    private String baseUrl;
    
    @Test
    public void someApiTest() {
        expect()
            .statusCode(200)
            .when()
            .get(baseUrl + "/hello");
    }		
}
```

This test will start the application with Undertow on an available port and test that the API exposed `/hello` returns
a 200 HTTP code when invoked with GET.

{{% callout info %}}
Note that we retrieve the dynamic base URL of the launched server using the special configuration property `runtime.web.baseUrl`.
More information about this [here]({{< ref "docs/web/index.md#server-information" >}}).
{{% /callout %}}

{{% callout tips %}}
As a convenience, a {{< java "org.seedstack.seed.undertow.LaunchWithUndertow" "@" >}} annotation is provided which, when
applied on the test class, will launch the tested application with Undertow and select an available TCP port for it. 
{{% /callout %}}

## Using Arquillian

For advanced Web testing, you can rely on the SeedStack support for [Arquillian](http://arquillian.org/) instead
of using a Web launcher. In that case, you loose SeedStack [testing features]({{< ref "docs/core/testing.md#testing-features" >}})
which are replaced by Arquillian testing features.

For Arquillian support, use the following dependency:

{{< dependency g="org.seedstack.seed" a="seed-testing-arquillian" s="test" >}}

Arquillian tests allow you to programmatically define a Web archive (WAR) and test it either from server-side or 
from client-side: 
 
```java
@RunWith(Arquillian.class)
public class SomeArquillianIT {
    @Deployment
    public static WebArchive createDeployment() {
        // You can use this method to customize the deployed archive
        return ShrinkWrap.create(WebArchive.class);
    }
    
    @Test
    @RunAsClient
    public void someApiTest(@ArquillianResource URL baseURL) {
        expect().statusCode(200).when().get(baseURL.toString() + "hello");
    }		
}
```

In this example, the test method, named `someApiTest`, is a client-side test. It is executed in a separate thread and 
can invoke the deployed Web application through the URL provided by the {{< java "org.jboss.arquillian.test.api.ArquillianResource" "@" >}} 
annotated parameter. 

{{% callout warning %}}
SeedStack support of Arquillian tests is limited to injection in client-side tests. As the test instance is created by 
Arquillian itself, it cannot be intercepted. 
{{% /callout %}}

The testing framework and the container(s) used for testing depend on the Arquillian configuration and the dependencies 
present in the classpath. 

Below you can find the dependencies needed (in addition to the one above) for testing using JUnit 4 and Tomcat 8 embedded:

```xml
<dependencies>
    <dependency>
        <groupId>org.jboss.arquillian.junit</groupId>
        <artifactId>arquillian-junit-container</artifactId>
        <version>${arquillian.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.jboss.arquillian.container</groupId>
        <artifactId>arquillian-tomcat-embedded-8</artifactId>
        <version>${arquillian-tomcat.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.apache.tomcat.embed</groupId>
        <artifactId>tomcat-embed-core</artifactId>
        <version>${tomcat.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.apache.tomcat.embed</groupId>
        <artifactId>tomcat-embed-jasper</artifactId>
        <version>${tomcat.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.apache.tomcat.embed</groupId>
        <artifactId>tomcat-embed-websocket</artifactId>
        <version>${tomcat.version}</version>
        <scope>test</scope>
    </dependency>
</dependencies>
``` 

