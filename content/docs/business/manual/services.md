---
title: "Services"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
tags:
    - domain-driven design
menu:
    BusinessManual:
        weight: 40
---

{{% callout def %}}
**A service is a stateless object that implements domain, applicative or infrastructure logic.**
{{% /callout %}}
<!--more-->

# Characteristics

Services can come in three flavors, depending upon the layer where they reside.

## Domain services

A domain service contains pure domain logic that does not fit naturally on any existing domain object. Its name and the name 
of its operations should come from the {{< term "ubiquitous language" >}} or be introduced into it if necessary. 
Parameters and return values should be domain objects or language types.

## Application services

An application service contains coordination logic between other services. It is more tied to a specific use-case 
of the system from which it execute all the steps in a well-defined unit of work. Application services are often the 
ideal place to begin and end transactions.

## Infrastructure services

An infrastructure service focuses on encapsulating a technical aspect of the application, like filesystem access, 
email, notifications, ...   

## Statelessness

A service is always stateless. This does not mean that a service cannot change the global state of the application
(that is, it may have side effects), but it should never hold a state of its own that could affect its behavior.

# Declaration

To create a service with the business framework, create an interface annotated with {{< java "org.seedstack.business.Service" "@" >}}:

```java
@Service
public interface SomeService {
    
    void someOperation();
}
```

{{% callout info %}}
This interface should be placed in the `services` package of the domain layer.
{{% /callout %}}

Then create its implementation:

```java
public class SomeServiceImpl implements SomeService {
    
    @Override
    public void someOperation() {
        // do something        
    }
}
```

{{% callout warning %}}
If your service implementation depends upon a technical aspect like a specific library or technology, put it in the 
infrastructure layer, otherwise put it along its interface.
{{% /callout %}}

{{% callout tips %}}
If you need to have multiple implementation of a service, you can apply a different [injection qualifier]({{< ref "docs/business/qualified-injection.md" >}}) 
on each implementation. 
{{% /callout %}}

# Usage

To use your service, simply [inject it]({{< ref "docs/seed/dependency-injection.md" >}}) where required: 

```java
public class SomeClass {
    @Inject
    private SomeService someService;
    
    public void someMethod() {
        someService.someServiceOperation();        
    }
}
```

{{% callout info %}}
By default, services are instantiated each time they are injected, avoiding the risk to wrongly keep an internal state 
between uses. In some cases, after having well considered the issue, you can choose to make your service a singleton by
annotating the service implementation with {{< java "javax.inject.Singleton" "@" >}}.
{{% /callout %}}

# Example

Let's consider a funds transfer service. It does not fit naturally into the `Account` aggregate since it may have some complex
business logic that depends upon other services (currency exchange rate, transfer authorization between countries, ...).

```java
@Service
public interface FundsTransferService {
    
    MoneyTransferReport transferMoney(
            Account toBeDebited,
            Account toBeCredited,
            Amount transferAmount
    );
}
```

{{% callout tips %}}
Notice how the name of the service and its operation is meaningful from a business perspective. Avoid services with generic 
names such as "AccountManagementService" or worse "AccountService". Try instead to convey business meaning by using names
from the {{< term "ubiquitous language" >}}.
{{% /callout %}}
