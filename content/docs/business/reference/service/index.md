---
title: "Service"
type: "reference"
zones:
    - "Business"
sections:
    - "BusinessService"
menu:
    BusinessService:
        weight: 10
---

Let's consider a bank account transfer.

- From the (sub)domain of a *bank account management* perspective, 
the transfer consists of an amount debited on an account which is credited on another account.

- The inherent logic of the transfer does not belong to any of the accounts but to a service of the Domain.
It's implementation can be rather simple or complicated depending on the rules applying to the process 
(currency exchange rate, transfer authorisation between countries, amount on originating account, etc.).

> The implementation of this service either belong to an *internal* package of the domain or more probably to an *infrastructure* one since it will require external libraries dealing with persistence.

```
@DomainService
public interface accountManagementService {
	
	public AccountTransferReport transferMoney(
		Account toBeDebited, 
		Account toBeCredited, 
		Amount transferAmount);
	
}
```

> Note : it is usually not recommended to have services with "Management" in their name as they tend to become the place to handle all behaviour for a domain instead of clearly naming specific services.
