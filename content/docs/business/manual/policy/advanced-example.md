---
title: "Advanced example"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessPolicy"
menu:
    BusinessPolicy:
        weight: 20
---

As an advances Policy example, let's consider an eligibility policy for admission as a car seller. For this example, 
we'll only consider two aspects: assets and experience.

# Policy packaging

Here is the SellerEligibilityPolicy packaging for `CandidateSeller` entity:

```
org.mycompany.myapp.carsale.domain.candidate/
|
|_ CandidateSeller.java                   (CandidateSeller entity)
|_ CandidateSellerFactory.java            (CandidateSeller factory interface)
|_ CandidateSellerFactoryImpl.java        (CandidateSeller factory implementation)
|_ CandidateGender.java                   (enum of candidates possible genders)
|_ policy/
   |
   |_ SellerEligibilityPolicy.java        (policy interface)
   |_ SellerEligibilityPolicyFactory.java (policy factory interface)
   |_ internal/                           (policy implementation classes)
      |
      |_ SellerEligibilityPolicyCommon.java       (policy abstract class implementation)
      |_ SellerEligibilityPolicyDefault.java      (policy default implementation)
      |_ SellerEligibilityPolicyWithHandicap.java (policy other implementation)

|_ SellerEligibilityPolicyFactoryImpl.java (policy factory implementation)

```

# Policy interface

Here is the policy exposed interface:

```
package org.mycompany.myapp.carsale.domain.candidate.policy;

import org.mycompany.myapp.carsale.domain.candidate.CandidateSeller;
import org.seedstack.business.api.domain.DomainPolicy;

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


# Policy factory

Since the policy has different behaviours (ie. default, with a handicap):

- an abstract class provides common behaviour and sub classes define specifics
- a policy factory is defined to provide the correct implementation according to the candidate:

```
package org.mycompany.myapp.carsale.domain.candidate.policy;

import org.mycompany.myapp.carsale.domain.candidate.CandidateSeller;
import org.seedstack.business.api.domain.GenericFactory;

public interface SellerEligibilityPolicyFactory
        extends GenericFactory<SellerEligibilityPolicy> {

    SellerEligibilityPolicy getSpecificPolicy(CandidateSeller candidate);
}
```

Injecting this factory allows a developer to get the appropriate `SellerEligibilityPolicy` according to the candidate 
and easily add implementations if more candidate types are required.
