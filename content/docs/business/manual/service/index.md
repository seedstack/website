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

* Creating a service interface in the domain,
* Creating a service implementation, located either in the domain or in the infrastructure if it depends upon any
specific technology.

Business Framework Services are POJOs, there is no mandated interface. Just annotate your service interface with the
`@Service` annotation.

# Example

Let's consider a bank account transfer.

* From the (sub)domain of a *bank account management* perspective, the transfer consists of an amount debited on an 
account which is credited on another account.
* The inherent logic of the transfer does not belong to any of the accounts but to a service of the Domain.
It's implementation can be rather simple or complex depending on the rules applying to the process (currency exchange 
rate, transfer authorisation between countries, amount on originating account, etc...).

```
@DomainService
public interface AccountTransferService {		
	public AccountTransferReport transferMoney( Account toBeDebited, Account toBeCredited, Amount transferAmount );		
}
```

{{% callout info %}}
Avoid services named like "AccountManagement" as they tend to become the place to handle all behaviour for a (sub)domain 
instead of clearly specifying the intent and responsibility.
{{% /callout %}} 
