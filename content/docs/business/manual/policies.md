---
title: "Policies"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - domain-driven design
menu:
    BusinessManual:
        weight: 70
---

{{% callout def %}}
**A policy is used to encapsulate a varying business rule or process in a separate object.<br>
Multiple versions of the policy object represent different ways the process can be done.**
{{% /callout %}}
<!--more-->

# Characteristics

## Business-oriented

The policy pattern is a domain-oriented variant of the [strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern).
Whereas the conventional strategy pattern focuses on the ability to substitute different algorithms, its use as a domain
pattern focuses on its ability to express a concept, usually a process or a policy rule.

# Declaration

To create a policy with the business framework, create an interface and annotated it with {{< java "org.seedstack.business.domain.Policy" "@" >}}:

```java
@DomainPolicy
public interface SomePolicy {
    
	double computeSomething(String someParameter);
}
```

{{% callout info %}}
Policies are part of the domain layer. They are either related to an aggregate, in which case this interface should be placed
in the corresponding aggregate package, or either related to a service, in which case this interface should be placed alongside
the service interface.
{{% /callout %}}

Then create one or more implementation of the policy interface:

```java
@Named("variantA")
public class SomePolicyVariantA {
    
    @Override
	public double computeSomething(String someParameter) {
	    // implement variant A logic
	}
}
```

```java
@Named("variantB")
public class SomePolicyVariantB {
    
    @Override
	public double computeSomething(String someParameter) {
	    // implement variant B logic
	}
}
```

{{% callout warning %}}
If a policy implementation depends upon a technical aspect like a specific library or technology, put it in the 
infrastructure layer, otherwise put it along its interface.
{{% /callout %}}

{{% callout info %}}
Note that if you have multiple variants of the same policy interface, each implementation must be [qualified]({{< ref "docs/business/qualified-injection.md" >}}). 
{{% /callout %}}

# Usage

To use a policy, simply inject it where required. If you have multiple qualified implementations of a policy, use add the
qualifier annotation of the required implementation:

```java
public class SomeClass {
    @Inject
    @Named("variantB")
    private SomePolicy somePolicy;
    
    @Override
	public void someMethod() {
	    double result = somePolicy.computeSomething("John Doe");
	}
}
```

{{% callout info %}}
By default, policies are instantiated each time they are injected, avoiding the risk to wrongly keep an internal state 
between uses. In some cases, after having well considered the issue, you can choose to make your policy a singleton by
annotating the policy implementation with {{< java "javax.inject.Singleton" "@" >}}.
{{% /callout %}}

# Example

## The interface:

```java
@DomainPolicy
public interface RebatePolicy {
    
    double calculateRebate(Order order);
}
```

## The VIP implementation

```java
@Named("VIP")
public class VIPRebatePolicy implements RebatePolicy {
    
    @Override
    public double calculateRebate(Order order) {
        if (order.totalPrice() < 20) {
            return order.totalPrice() * 0.1d;
        } else {
            return order.totalPrice() * 0.2d;
        }
    }
}
```

## The seasonal implementation

```java
@Named("seasonal")
public class SeasonalRebatePolicy implements RebatePolicy {
    
    @Override
    public double calculateRebate(Order order) {
        return order.totalPrice() * 0.15d;
    }
}
```
