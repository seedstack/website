---
title: "Qualified injection"
type: "home"
zones:
    - "Docs"
tags:
    - essentials
    - domain-driven design
    - injection
menu:
    docs:
        parent: "business"
        weight: 7
---

In the business framework, you always [inject]({{< ref "docs/basics/dependency-injection.md" >}}) dependencies by interface
not by implementation class. For each injection point, two situations are possible:

* If only one implementation exists for a specific interface, it is injected without ambiguity.
* If multiple exists for a specific interface, the injection point should be qualified to select the implementation to 
inject. This done by putting an **qualifier annotation** along the {{< java "javax.inject.Inject" "@" >}} annotation. 

## Built-in qualifiers

SeedStack provides several built-in qualifiers. 

### @InMemory 

The {{< java "org.seedstack.business.util.inmemory.InMemory" "@" >}} qualifier denotes an implementation that stores its state
in memory only. It currently can be applied to:

* The {{< java "org.seedstack.business.domain.Repository" >}} interface for selecting an implementation of repository that
stores aggregates in a map.
* The {{< java "org.seedstack.business.util.SequenceGenerator" >}} interface for selecting an implementation that generates
a sequence of numbers with an {{< java "java.util.concurrent.atomic.AtomicLong" >}}. 

### @Random

The {{< java "org.seedstack.business.util.random.Random" "@" >}} qualifier denotes an implementation that uses random values.
It currently can be applied to:

* The {{< java "org.seedstack.business.util.UuidGenerator" >}} interface for selecting an implementation that generates
a random {{< java "java.util.UUID" >}}. 

### Other built-in qualifiers

Other qualifiers can be found in [add-ons]({{< baseUrl >}}addons), particularly in persistence add-ons.

## Generic @Named qualifier 

The {{< java "javax.inject.Named" "@" >}} annotation is a qualifier that uses a String as the qualifying element. This is
the only qualifier that is part of the JSR-330 standard.
 
As an example, consider the following [policy]({{< ref "docs/business/policies.md" >}}%) interface:

```java
@Policy
public interface TaxesPolicy {
    int computeTaxes(Order order);
}
```

You can have multiple implementation of this policy, for instance one for each country. To define a qualified implementation,
apply the {{< java "javax.inject.Named" "@" >}} annotation on the implementation class. Consider the France implementation:

```java
@Named("FR")
public class FranceTaxesPolicy implements TaxesService {
    int computeTaxes(Order order){
        // ...
    }
}
```

And the United Kingdom implementation:

```java
@Named("UK")
public class UnitedKingdomTaxesPolicy implements TaxesService {
    int computeTaxes(Order order){
        // ...
    }
}
```

Having defined at least two implementations of the same interface, you can choose which one to inject by reusing the same
qualifier injection point:

```java
public class SomeClass {
    @Inject 
    @Named("FR")
    private TaxesPolicy frenchTaxesPolicy;
    
    @Inject 
    @Named("UK")
    private TaxesPolicy ukTaxesPolicy;
}
```

Sometimes, you need to dynamically select the right implementation. You can do so by using the {{< java "org.seedstack.business.domain.DomainRegistry" >}}:

```java
public class SomeClass {
    @Inject
    private DomainRegistry domainRegistry;
    
    public void someMethod(CountryCode userCountryCode) {
        TaxesPolicy userTaxesPolicy = domainRegistry.getPolicy(TaxesPolicy.class, userCountryCode);
    }
}
```

## Defining a custom qualifier

You can choose to write your own qualifier. To do this, create a custom annotation that is itself annotated by 
{{< java "javax.inject.Qualifier" "@" >}}:

```java
@Qualifier
@Target({ TYPE, METHOD, FIELD })
@Retention(RUNTIME)
public @interface France {
}
```

You can then qualify an implementation with it:

```java
@France
public class FranceTaxesPolicy implements TaxesService {
    int computeTaxes(Order order){
        // ...
    }
}
```

And use it at the injection point:

```java
public class SomeClass {
    @Inject 
    @France
    private TaxesPolicy frenchTaxesPolicy;   
}
```

## Patterns supporting qualifiers

The business framework support qualified injection for the following interfaces:

* [Factories]({{< ref "docs/business/factories.md" >}}),
* [Identity generators]({{< ref "docs/business/factories.md#identity-generation" >}}),
* [Repositories]({{< ref "docs/business/repositories.md" >}}),
* [Services]({{< ref "docs/business/services.md" >}}),
* [Policies]({{< ref "docs/business/policies.md" >}}),
* [Assemblers]({{< ref "docs/business/assemblers.md" >}}).
