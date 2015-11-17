---
title: "Policies"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessManual"
menu:
    BusinessManual:
        weight: 50
---

A policy is a variant of the Strategy pattern to encapsulate one or more business rules.

# Definition

Creating a Policy with the Business Framework, consists in:

* Creating a policy interface in the domain,
* Creating a policy implementation, located either in the domain or in the infrastructure if it depends upon any
specific technology.

Business Framework Policies are POJOs, there is no mandated interface. Just annotate your policy interface with the
`@DomainPolicy` annotation.

# Usage

To use a policy, simply inject it in your code:

    @Inject
    MyPolicy myPolicy;

# Example

Let's consider a bonus policy for car sellers according to the sales they've done. 
This policy could allow the sellers - and their manager - to know what the amount of their bonus is at a given time in
the current month.

## BonusPolicy interface

In `org.mycompany.myapp.policy` package

```
package org.mycompany.myapp.policy;

import org.mycompany.myapp.domain.model.carsold.CarSold;
import org.mycompany.myapp.domain.shared.vo.Price;
import org.seedstack.business.domain.DomainPolicy;

import java.util.List;

@DomainPolicy
public interface BonusPolicy {
	Price computeBonus(List<CarSold> carSolds);
}
```

## BonusPolicy implementation

Below is an implementation example.

In `org.mycompany.myapp.policy.internal` package

```
package org.mycompany.myapp.policy.internal;

import ...

public class BonusPolicyInternal implements BonusPolicy{

    @Override
	public Price computeBonus(List<CarSold> soldCarsList) {
        ...
		return finalBonus;
	}
}
```

## BonusPolicy usage

Wherever the policy is used to compute the bonus of a particular employee, just retrieve the cars sold by this employee 
(through the sold cars repository) and call the policy:

- Interface

```
package org.mycompany.myapp.application.service;

import org.mycompany.myapp.domain.model.employee.Employee;
import org.seedstack.business.Service;

@Service
public interface SalesBonusService {
    double calculateCurrentBonusFor(Employee employee);
}
```

- Implementation

```
package org.mycompany.myapp.application.service.internal;

import ...

public class SalesBonusServiceInternal implements SalesBonusService {
	
	@Inject
	CarSoldRepository carSoldRepository;
	
	@Inject
	CarForSaleRepository carForSaleRepository;
	
	@Inject
	BonusPolicy bonusPolicy;
	
	@Override
	public double calculateCurrentBonusFor(Employee employee) {
		List<CarSold> findByEmployee = carSoldRepository
             .findByEmployee(employee.getEntityId());
		Price bonus = bonusPolicy.computeBonus(findByEmployee);
		return bonus.getPriceValue();
	}
}
```

Then, one can just inject the service and compute a bonus whenever an `Employee` entity is at reach (eg. while building
an employee profile page).

