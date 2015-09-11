---
title: "Service"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessService"
menu:
    BusinessService:
        weight: 10
---

Services are stateless objects that implement logic which doesn't fit in the aggregates.
 
{{% callout info %}}
This page describes how to implement **Services** with the Business framework. To know more about the Service concept, refer
to [this section](../../concepts/domain-model/#service).
{{% /callout %}} 

# Usage

Creating a Service with the Business Framework, consists in:

* Creating a service interface, annotated with the `@Service` annotation. Business Framework Services are POJOs, there is no mandated super interface.
* Creating a service implementation.

# Characteristics

Services can be found in various locations:

* The domain, where services contain pure business logic. Naming should come from the {{< term "ubiquitous language" >}} or be introduced into it if necessary. Parameters and return values should be domain objects. Example: a bank account transfer service.
* The infrastructure, where services deal with specific technological aspects. Example: a notification sending service.
* The application, where services contain coordination logic between other services and are more tied to a specific use-case. These services are often the ideal place to begin and end a transaction.
 
{{% callout info %}}
A good service is always stateless. That doesn't mean that a service cannot change the global state of the application (that is, it may have side effects), but it should never hold a state of its own that could affect its behavior.
{{% /callout %}}

# Example

Let's consider a bank account transfer, which is a service belonging to the domain.

* From the domain of a *bank account management* perspective, the transfer consists of an amount debited on an 
account which is credited on another account.
* The inherent logic of the transfer does not belong to any of the accounts but to a service of the Domain.
It's implementation can be rather simple or complex depending on the rules applying to the process (currency exchange 
rate, transfer authorisation between countries, amount on originating account, etc...).

```
@Service
public interface AccountTransferService {		

    public AccountTransferReport transferMoney(Account toBeDebited, Account toBeCredited,
            Amount transferAmount);	
            
}
```

{{% callout info %}}
Avoid services named like "AccountManagement" as they tend to become the place to handle all behaviour for a (sub)domain 
instead of clearly specifying the intent and responsibility.
{{% /callout %}} 
