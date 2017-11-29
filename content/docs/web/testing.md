---
title: "Web testing"
type: "home"
zones:
    - "Docs"
tags:
    - tutorial
    - testing
menu:
    docs:
        parent: "web"
        weight: 2
---

The `seed-testing` module provide tools for testing your code, including Web applications through [Arquillian](http://arquillian.org/).<!--more--> 

Web testing support requires the following dependencies in your project:

{{< dependency g="org.seedstack.seed" a="seed-testing" s="test" >}}

{{< dependency g="org.seedstack.poms" a="arquillian-composite" s="test" t="pom" >}}

{{% callout warning %}}
Be sure to specify the `test` scope for these dependencies.
{{% /callout %}}

Arquillian tests allow you to programmatically define the Web archive (WAR) and test it either from server-side or 
from client-side. 

To declare a Web integration test, make your JUnit test class extends {{< java "org.seedstack.seed.it.AbstractSeedWebIT" >}}: 
 
```java
public class RestIT extends AbstractSeedWebIT {
    @Deployment
    public static WebArchive createDeployment() {
        // You can use this method to customize the deployed archive
        return ShrinkWrap.create(WebArchive.class);
    }
    
    @Test
    @RunAsClient
    public void myRestResourceIsWorking(@ArquillianResource URL baseURL) {
        expect().statusCode(200).when().get(baseURL.toString() + "rest/my-resource");
    }		
}
```

In this example, the test method, named `myRestResourceIsWorking`, is a client-side test. It is executed in a separate 
thread and can invoke the deployed Web application through the URL provided by the 
{{< java "org.jboss.arquillian.test.api.ArquillianResource" "@" >}} annotated parameter. 

{{% callout info %}}
[Apache Tomcat](http://tomcat.apache.org/) is the default test server configured. You can override this choice by specifying
a custom `arquillian.xml` file at the root of the classpath. Arquillian provides many more features than described in
this section. For more information about Arquillian, visit the [official website](http://arquillian.org/). 
{{% /callout %}}

{{% callout info %}}
The test class is instantiated by Arquillian and as such cannot be intercepted. It can still be injected. 
{{% /callout %}}
