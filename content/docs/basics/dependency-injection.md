---
title: "Dependency injection"
type: "home"
zones:
    - "Docs"
tags:
    - injection
    - tutorial
menu:
    docs:
        parent: "basics"
        weight: 3
---

SeedStack development model is based on the [dependency injection principle](https://en.wikipedia.org/wiki/Dependency_injection)
where the dependencies of a class are injected in it by the framework instead of looked up.<!--more-->

You use the `javax.inject` standard in application code. Injection is done by applying the {{< java "javax.inject.Inject" "@" >}} 
annotation on **fields, constructors or methods**.

{{% callout info %}}
The Java type at the injection point determines what to inject.  <br/> If present, generic parameters are taken into 
account.
{{% /callout %}}

{{% callout warning %}}
Objects created with `new` are not injected automatically. <br/> Only instances created by the framework are injected automatically. 
{{% /callout %}}

## By field

Edit the `HelloResource` class to inject the {{< java "org.seedstack.seed.Application" >}} framework interface in a field:

```java
package org.generated.project.interfaces.rest;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import org.generated.project.application.MyConfig;
import org.seedstack.seed.Application;

@Path("hello")
public class HelloResource {
    @Inject
    private Application application;

    @GET
    public String hello() {
        MyConfig myConfig = application.getConfiguration()
                .get(MyConfig.class);
        return "Hello " + myConfig.getNames().get(0) + "!";
    }
}
``` 

Field injection is very concise (which is why it is used in the documentation) but does not play well with testing and 
does not allow the creation of immutable objects.

## By constructor

Edit the `HelloResource` class to inject the {{< java "org.seedstack.seed.Application" >}} framework interface through
the constructor:
 
```java
package org.generated.project.interfaces.rest;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import org.generated.project.application.MyConfig;
import org.seedstack.seed.Application;

@Path("hello")
public class HelloResource {
    private final Application application;

    @Inject
    public HelloResource(Application application) {
        this.application = application;
    }

    @GET
    public String hello() {
        MyConfig myConfig = application.getConfiguration()
                .get(MyConfig.class);
        return "Hello " + myConfig.getNames().get(0) + "!";
    }
}
``` 

Constructor injection allows to create immutable objects and allows to easily provide mocks for testing. Constructor
injection is the only way to access dependencies from the constructor of an object.
 
## By method 
 
Method injection works similarly to the constructor injection but has the downside of permitting the change of internal state 
after injection happened. **Method injection is NOT recommended.**

## Singleton or not ?

The default behavior is to **re-create an instance each time it is injected**. This is a good thing as it avoids 
complex global state bugs and scales better because no synchronization is needed.

Put a breakpoint in the `HelloResource` class inside the `hello()` method. You can see that each time the method is invoked,
the resource instance is different.

However when the an object is inherently stateful and/or expensive to create, the {{< java "javax.inject.Singleton" "@" >}}
annotation can be applied on the implementation. The same instance will be reused for the lifetime of the application.

Now edit the `HelloResource` class to make the resource a singleton:

```java
package org.generated.project.interfaces.rest;

import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

@Singleton
@Path("hello")
public class HelloResource {
    @GET
    public String hello() {
        return "Hello World!";
    }
}
```

Verify with the debugger that the same instance of the resource is reused for the lifetime of the application. 

## Method interception

SeedStack also supports method interception **with some limitations**. Method interception is useful to add cross-cutting
concerns ("aspects") to existing code. For instance, SeedStack uses it for transactions, security enforcement or validation. 

Method interception is implemented by dynamic subclassing and overriding of relevant methods. It has very little overhead
but has the following limitations:

* Class must be public or package-private,
* Class must be non-final,
* Method must be public, package-private or protected,
* Method must be non-final,
* Instances must be created by SeedStack (interception cannot be used on instances created with `new`).  

{{% callout warning %}}
**Caution:** if the conditions above are not met, method interception will NOT take place.  
{{% /callout %}}

## Google Guice

To do dependency injection and method interception, SeedStack uses [Google Guice](https://github.com/google/guice), a 
lightweight dependency injection framework. 

**Google Guice is completely hidden from normal application code** by the use of the `javax.inject` ([JSR 330](https://jcp.org/en/jsr/detail?id=330)) 
injection standard. Unless you are doing something very specific (like writing an extension to SeedStack) your code should not depend upon Guice classes.

## Now what ?

On this page you have learned:

* How to inject a dependency by field injection,
* How to inject a dependency by constructor injection,
* When and how to declare an implementation as Singleton.

### Troubleshooting

If you can't get this to work, check the [troubleshooting page]({{< ref "docs/basics/troubleshooting.md" >}}).

### Next step

If you want to learn more, continue on the tutorial to learn how to write a [business domain model]({{< ref "docs/basics/business.md" >}}).

