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

# Policy interface

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


# Policy factory

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

Injecting this factory allows a developer to get the appropriate `SellerEligibilityPolicy` according to the candidate 
and easily add implementations if more candidate types are required.
