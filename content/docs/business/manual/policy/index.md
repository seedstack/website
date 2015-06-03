---
title: "Policy"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessPolicy"
menu:
    BusinessPolicy:
        weight: 10
---

A policy is a variant of the Strategy pattern to encapsulate one or more business rules.

{{% callout info %}}
This page describes how to implement **Policies** with the Business framework. To know more about the Policy concept, 
refer to [this section](../../concepts/domain-model/#domain-event).
{{% /callout %}} 

# Usage

Creating a Policy with the Business Framework, consists in:

* Creating a policy interface in the domain,
* Creating a policy implementation, located either in the domain or in the infrastructure if it depends upon any
specific technology.

Business Framework Policies are POJOs, there is no mandated interface. Just annotate your policy interface with the
`@DomainPolicy` annotation.

# Example

Let's consider a bonus policy for car sellers according to the sales they've done. 
This policy could allow the sellers - and their manager - to know what the amount of their bonus is at a given time in the current month.

> This example is adapted from the SEED Business Framework training application.

## BonusPolicy interface

In `org.mycompany.myapp.policy` package


```
package org.mycompany.myapp.policy;

import org.mycompany.myapp.domain.model.carsold.CarSold;
import org.mycompany.myapp.domain.shared.vo.Price;
import org.seedstack.business.api.domain.annotations.DomainPolicy;

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

import java.util.List;
import javax.inject.Inject;

import org.mycompany.myapp.policy.BonusPolicy;
import org.mycompany.myapp.domain.model.carsold.CarSold;
import org.mycompany.myapp.domain.shared.vo.Price;

public class BonusPolicyInternal implements BonusPolicy{
	
	/**
	 * Compute annual bonus according the following :
	 *  <li>X%  from CarSolds  agreed price sum</li>
	 *  <li>Where X is  </li>
	 *  <li> 1.5% if discount <= 5%  </li>
	 *  <li> 1.0% if discount >  5%   </li>
	 * 
	 */
	@Override
	public Price computeBonus(List<CarSold> soldCarsList) {
		Price finalBonus = Price.ZERO;
		for (CarSold carSold : soldCarsList) {
			// note : in the training app, following code is replaced by another policy to avoid computation redundancy and increase readability
			double discount = 
			BigDecimal.valueOf(1d)
				.subtract(BigDecimal.valueOf(carSold.getAgreedPrice().getPriceValue())
					.divide(BigDecimal.valueOf(carSold.retrieveOriginalPrice().getPriceValue()))
				)
			.doubleValue();
			
			if (discount <= 0.05) {
				finalBonus = finalBonus.add(  0.015 * carSold.getAgreedPrice().getPriceValue());
			} else if (discount > 0.05) {
				finalBonus = finalBonus.add(  0.01 * carSold.getAgreedPrice().getPriceValue());
			}
		}
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
import org.seedstack.business.api.application.annotations.ApplicationService;

@Service
public interface SalesBonusService {
    double calculateCurrentBonusFor(Employee employee);
}
```

- Implementation

```
package org.mycompany.myapp.application.service.internal;

import java.util.List;
import javax.inject.Inject;

import org.mycompany.myapp.application.policy.BonusPolicy;
import org.mycompany.myapp.application.service.SalesBonusService;
import org.mycompany.myapp.domain.model.carforsale.CarForSaleRepository;
import org.mycompany.myapp.domain.model.carsold.CarSold;
import org.mycompany.myapp.domain.model.carsold.CarSoldRepository;
import org.mycompany.myapp.domain.model.employee.Employee;
import org.mycompany.myapp.domain.shared.vo.Price;

public class SalesBonusServiceInternal implements SalesBonusService {
	
	@Inject
	CarSoldRepository carSoldRepository;
	
	@Inject
	CarForSaleRepository carForSaleRepository;
	
	@Inject
	BonusPolicy bonusPolicy;
	
	@Override
	public double calculateCurrentBonusFor(Employee employee) {
		List<CarSold> findByEmployee = carSoldRepository.findByEmployee( employee.getEntityId() );
		Price bonus = bonusPolicy.computeBonus(findByEmployee);
		return bonus.getPriceValue();
	}
}
```

Then, one can just inject the service and compute a bonus whenever an `Employee` entity is at reach (eg. while building an employee profile page).
