---
title: "Qualified injection"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - "injection"
tags:
    - essentials
    - domain-driven design
    - injection
menu:
    BusinessEssentials:
        weight: 50
---

With the business framework, much like the rest of SeedStack, you declare injection points with an interface type not an 
implementation one. The framework discovers any implementation of a specific interface and will inject it through its interface.

For a specific interface, the business framework supports multiple implementations. This is particularly useful when you
have multiple algorithms of implementation technologies for an interface. 

If multiple implementations of a specific interface are found, you must use a qualifier on each one to differentiate 
them. Qualifiers are annotations that are annotated with {{< java "javax.inject.Qualifier" "@" >}}. To choose an implementation
at the injection point, simply use the same qualifier as the implementation and put it alongside the `@Inject` annotation. 

# @Named qualifier

The {{< java "javax.inject.Named" "@" >}} annotation is a qualifier that uses a String as the qualifying element. This is
the only qualifier that is part of the JSR-330 standard.
 
As an example, consider the following [policy]({{< ref "docs/business/manual/policies.md" >}}%) interface:

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
    @Inject @Named("FR")
    private TaxesPolicy frenchTaxesPolicy;
    
    @Inject @Named("UK")
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

# Custom qualifier

You can choose to write your own qualifier. To do this, create a custom annotation that is itself annotated by 
{{< java "javax.inject.Qualifier" "@" >}}:

```java
@Qualifier
@Target({ TYPE, METHOD, FIELD })
@Retention(RUNTIME)
public @interface France {
}
```

You can then use it just like the {{< java "javax.inject.Named" "@" >}} qualifier:

```java
public class SomeClass {
    @Inject @France
    private TaxesPolicy frenchTaxesPolicy;   
}
```

To use it with the domain registry, pass the annotation class instead of the String qualifier.

# Patterns supporting qualifiers

The business framework support qualified injection for the following patterns:

* [Services]({{< ref "docs/business/manual/services.md" >}}),
* [Factories]({{< ref "docs/business/manual/factories.md" >}}),
* [Repositories]({{< ref "docs/business/manual/repositories.md" >}}),
* [Policies]({{< ref "docs/business/manual/policies.md" >}}),
* [Assemblers]({{< ref "docs/business/manual/assemblers.md" >}}),
* [Finders]({{< ref "docs/business/manual/finders.md" >}}).

