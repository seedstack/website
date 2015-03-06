---
title: "Supple design"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 70
---

SEED Business Framework has be designed with Supple Design in a way that helps maintain a Supple Design in your projects.

# Introduction

Supple Design can be applied outside of DDD but it is also an important part of DDD that provides flexibility, readability and scalability to your code (avoiding lots of the spaghetti syndrome). The idea is to keep code clear, meaningful, simple and give each object a specific role without permitting oneself to be too approximative in what attribute or behaviour belongs to which object. In that matter, all the previously described patterns - especially in the [domain layer](#!/business-doc/understanding-ddd/supple-design) - make great sense.

> There is never one way to correctly (or poorly) design .

[Eric Evans](#!/business-doc/understanding-ddd) provides a list of design patterns that are essential to Supple Design. Some are qualified as being "declarative" others are more "conceptual". We'll try to define and illustrate them.


> Some definitions of this page are inspired from [http://dddcommunity.org/resources/ddd_terms](http://dddcommunity.org/resources/ddd_terms)


# Declarative patterns

- **Intention-Revealing Interface**: Only use interfaces and reveal how they should be used:

	- implementation can change without affecting any of the outside expected behaviour
	- make methods signatures clear using meaningful Value Objects and Entities rather than primitives and associated classes (eg. String, long, BigDecimal, etc.)
		- for instance : `AvailabilityReport checkVehicleAvailability(`[VIN](#!/business-doc/hands-on-domain#example-2---vin)` vin)`
		- instead of : `List<String> checkVehicleAvailability(String vin)`
	
- **Side-Effect-Free Function**:  

	- Do not affect the state of the manipulated objects or the system 
	- eg. a MessageService uses objects to send messages without having to alter them. If it fails, the system should not be impacted
	
- **Assertion**: A statement of the correct state of a program at some point, independent of how it does it
	- whether the result of an operation (eg. a function that should throw an exception if it has no result to return) 
	- or an invariant by design (eg. an order has at least one item).

- Other declarative patterns include  : Domains-Specific language

# Other patterns and concepts	
	
- **Conceptual Contour**: this is about correctly modelling your domain objects as mentioned in the introduction paragraph. 

	- Do your domain objects (attributes, responsibilities, etc.) reflect the business and make sense for the final user of the application. 
	- Eg. Nailing down in the model some actual consistency of the business - even if not used in the first place - will avoid having to redesign it later on.

- **Standalone Class**: 

	- A class that can be understood and tested without reference to any other, except system primitives and basic libraries. 
	- A typical example would be a [Value Object](#!/business-doc/understanding-ddd/domain-layer#value-object).

- **Closure of Operations**: 

	- An operation whose argument(s) and return share the same type. 
	- eg. Manipulating Money (add, divide, subtract, multiply) has to return Money! ie. `Money add(Money addedAmout)`
