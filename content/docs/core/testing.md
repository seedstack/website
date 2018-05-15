---
title: "Integration testing"
type: "home"
zones:
    - "Docs"
tags:
    - tutorial
    - testing
menu:
    docs:
        parent: "core"
        weight: 2
---

SeedStack provides several features and tools to do integration testing in your application.<!--more--> 

The purpose of integration tests is to test the interaction of multiple components together. They are different from unit
tests which test only a component (a class) at a time. 

## JUnit 4

To run an integration test with JUnit 4, you need to add the following dependency in your application:

{{< dependency g="org.seedstack.seed" a="seed-testing-junit4" s="test" >}}

Then you need to specify that your test class will run using the {{< java "org.seedstack.seed.testing.junit4.SeedITRunner" >}} 
JUnit runner: 

```java
@RunWith(SeedITRunner.class)
public class SomeIT {
    @Inject
    private Application application;

    @Test
    public void myTestIsInjected() {
        Assertions.assertThat(application).isNotNull();
    }		
}
```

{{% callout info %}}
Test class instances will be injected and can be intercepted (for instance for transaction testing).
{{% /callout %}}

## Other testing frameworks

SeedStack can support multiple testing frameworks but ships only with JUnit 4 support for now.

## Testing features

Regardless of the testing framework, SeedStack provides several features to help altering the application environment
during testing.

### Altering launch

By default, SeedStack starts the tested application using a built-in launcher that simulates a command-line environment.
This can be changed by applying the {{< java "org.seedstack.seed.testing.LaunchWith" "@" >}} annotation on the test class:

```java
@RunWith(SeedITRunner.class)
@LaunchWith(MyCustomLauncher.class)
public class SomeIT {
    @Test
    public void testSomething() {
        // ...
    }		
}
```

With this annotation, you can specify:

* The implementation of {{< java "org.seedstack.seed.spi.SeedLauncher" >}} to use to run the tested application.
* The {{< java "org.seedstack.seed.testing.LaunchMode" >}} of the tested application: once per test class, once per test
or never (in which case it should be started by other means).

### Altering configuration

You can alter the configuration of the tested application by using the {{< java "org.seedstack.seed.testing.ConfigurationProperty" "@" >}}
annotation, on the test class, on a particular test method or both:

```java
@RunWith(SeedITRunner.class)
@ConfigurationProperty(name = "someTestKey", value = "testValue")
public class SomeIT {
    @Test
    public void testSomething() {
        // ...
    }		
}
```

You can also activate a [configuration profile]({{< ref "docs/core/configuration.md#profiles" >}}) on the tested application 
by using the {{< java "org.seedstack.seed.testing.ConfigurationProfiles" "@" >}} annotation, on the test class, on a particular 
test method or both:

```java
@RunWith(SeedITRunner.class)
@ConfigurationProfiles({"dev", "debug"})
public class SomeIT {
    @Test
    public void testSomething() {
        // ...
    }		
}
```

### Altering system properties

You can alter the system properties of the tested application by using the {{< java "org.seedstack.seed.testing.SystemProperty" "@" >}}
annotation, on the test class, on a particular test method or both:

```java
@RunWith(SeedITRunner.class)
@SystemProperty(name = "someTestProperty", value = "testValue")
public class SomeIT {
    @Test
    public void testSomething() {
        // ...
    }		
}
```

### Altering arguments

You can specify the arguments passed to the launcher by using the {{< java "org.seedstack.seed.testing.Arguments" "@" >}}
annotation, on the test class, on a particular test method or both:

```java
@RunWith(SeedITRunner.class)
@Arguments({"-o", "someValue"})
public class SomeIT {
    @Test
    public void testSomething() {
        // ...
    }		
}
``` 

{{% callout warning %}}
When the {{< java "org.seedstack.seed.testing.Arguments" "@" >}} annotation is used on a **test method**, the 
[launch mode]({{< ref "#altering launch" >}}) must be set to `PER_TEST`, otherwise it is ignored.
{{% /callout %}}

### Altering kernel parameters
	
You can alter the SeedStack kernel parameters by using the {{< java "org.seedstack.seed.testing.KernelParameter" "@" >}}
annotation, on the test class, on a particular test method or both:

```java
@RunWith(SeedITRunner.class)
@KernelParameter(name = "seedstack.autodetectModules", value = "false")
public class SomeIT {
    @Test
    public void testSomething() {
        // ...
    }		
}
``` 

{{% callout warning %}}
When the {{< java "org.seedstack.seed.testing.KernelParameter" "@" >}} annotation is used on a **test method**, the 
[launch mode]({{< ref "#altering launch" >}}) must be set to `PER_TEST`, otherwise it is ignored.
{{% /callout %}}

### Expecting a launch exception

You can test for a particular exception to occur during the launch of the tested application by using the 
{{< java "org.seedstack.seed.testing.Expected" "@" >}} annotation on the test class, on a particular test method or both:

```java
@RunWith(SeedITRunner.class)
@Expected(SomeException.class)
public class SomeIT {
    @Test
    public void testSomething() {
        // ...
    }		
}
```     
	
{{% callout warning %}}
When the {{< java "org.seedstack.seed.testing.Expected" "@" >}} annotation is used on a **test method**, the 
[launch mode]({{< ref "#altering launch" >}}) must be set to `PER_TEST`, otherwise it is ignored.
{{% /callout %}}	
