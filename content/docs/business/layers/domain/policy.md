---
title: "Policy"
zones:
    - "Business"
sections:
    - "BusinessDomainLayer"
menu:
    BusinessDomainLayer:
        weight: 70
---

Minimum requirement for your policy is to annotate the interface with `@Policy` to easily get the generic behaviour of a Policy.

# BonusPolicy example

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

Wherever the policy is used to compute the bonus of a particular employee, just retrieve the cars sold by this employee (through the sold cars repository) and call the policy. In the SEED Business Framework training application, a dedicated `@ApplicationService` is used for this purpose:

- Interface

```
package org.mycompany.myapp.application.service;

import org.mycompany.myapp.domain.model.employee.Employee;
import org.seedstack.business.api.application.annotations.ApplicationService;

@ApplicationService
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

# SellerEligibilityPolicy example

Let's consider an eligibility policy for admission as a car seller. For this example, we'll only consider two aspects: assets and experience.

>[Download](#!/downloads) this example code from download page under [SEED Business Framework] section as [seed-carsale-policy-domain-sample].

## Policy packaging

Here is the SellerEligibilityPolicy packaging for `CandidateSeller` entity:

```
+org.mycompany.myapp.carsale.domain.candidate/

CandidateSeller.java                     (CandidateSeller entity)
CandidateSellerFactory.java              (CandidateSeller factory interface)
CandidateSellerFactoryImpl.java          (CandidateSeller factory implementation)
CandidateGender.java                     (enum of candidates possible genders)

+org.mycompany.myapp.carsale.domain.candidate.policy/

SellerEligibilityPolicy.java             (policy interface)
SellerEligibilityPolicyFactory.java      (policy factory interface)

+org.mycompany.myapp.carsale.domain.candidate.policy.internal/ (policy implementation classes)

SellerEligibilityPolicyCommon.java       (policy abstract class implementation)
SellerEligibilityPolicyDefault.java      (policy default implementation)
SellerEligibilityPolicyWithHandicap.java (policy implementation for candidates with a handicap)

SellerEligibilityPolicyFactoryImpl.java (policy factory implementation)

```

## Policy interface

Here is the policy exposed interface:

```
package org.mycompany.myapp.carsale.domain.candidate.policy;

import org.mycompany.myapp.carsale.domain.candidate.CandidateSeller;
import org.seedstack.business.api.domain.annotations.DomainPolicy;

@DomainPolicy
public interface SellerEligibilityPolicy {
	/**
	 * Assets CHECK - return a percentage (between 0.0 and 1.0) of expected assets
	 * @param candidate
	 * @return Double
	 */
	Double hasRequiredAssets(CandidateSeller candidate); 
	/**
	 * experience CHECK
	 * @param candidate
	 * @return
	 */
	boolean hasValidExperience(CandidateSeller candidate);
}
```

- the policy interface is annotated with `@DomainPolicy`
- the policy exposes methods to evaluate a `CandidateSeller`


## Policy factory

Since the policy has different behaviours (ie. default, with a handicap):

- an abstract class provides common behaviour and sub classes define specifics
- a policy factory is defined to provide the correct implementation according to the candidate:

```
package org.mycompany.myapp.carsale.domain.candidate.policy;

import org.mycompany.myapp.carsale.domain.candidate.CandidateSeller;
import org.seedstack.business.api.domain.GenericFactory;

public interface SellerEligibilityPolicyFactory extends GenericFactory<SellerEligibilityPolicy> {
	    SellerEligibilityPolicy getSpecificPolicy(CandidateSeller candidate);
}
```

Injecting this factory allows a developer to get the appropriate `SellerEligibilityPolicy` according to the candidate and easily add implementations if more candidate types are required.

> Possible uses are illustrated in integration tests of the [download](#!/business-doc/hands-on-domain/policy#sellereligibilitypolicy-example).
