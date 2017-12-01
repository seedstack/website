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

The `seed-testing` module provide tools to do integration testing.<!--more--> 

The purpose of integration tests is to test the interaction of multiple components together. They are different from unit
tests which test only a component (a class) at a time. 

SeedStack testing tools are based upon the popular [JUnit](http://junit.org/) testing framework. Testing support 
requires the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-testing" s="test" >}}

{{% callout warning %}}
Be sure to specify the `test` scope for this dependency.
{{% /callout %}}

## SeedStack runner

To run an integration test with SeedStack, make your test class extend the {{< java "org.seedstack.seed.it.AbstractSeedIT" >}} 
class, which has the effect of using the {{< java "org.seedstack.seed.it.SeedITRunner" >}} JUnit runner:

```java
public class SomeIT extends AbstractSeedIT {
    @Inject
    private Application application;

    @Test
    public void myTestIsInjected() {
        Assertions.assertThat(application).isNotNull();
    }		
}
```

Test class instances will be injected and can be intercepted (for instance for transaction testing).
	
## Execution order	
	
The SeedStack runner will do these operations in order:

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

