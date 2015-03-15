---
title: "Application layer"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 40
---

The application layer handles application wide technical concerns such as security, logging, transactions, aggregates 
or consistency.

The application layer also coordinates the domain layer and adds its own services on top if needed. Those services brings the 
additional behavior needed on top of the domain(s) to answer application use cases.

Ideally, it should not contain domain behaviour although It can host infrastructure packages and/or implementations 
of interfaces contained in the domain layer.

# Application Services

- Like other services, an application service is **stateless**
- An application service usually involves infrastructure and/or libraries "to do the job".

As an example, take a notification service used to alert the user that an action has completed or that there was a
problem. This kind of service is not in the domain but can be invoked along domain services to fully implement a use
case.  
