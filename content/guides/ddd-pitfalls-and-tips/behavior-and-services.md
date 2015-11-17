---
title: "Behavior and services"
guide: "DDD pitfalls and tips"
author: "SeedStack"
menu:
    DDDPitfallsAndTipsGuide:
        weight: 50
---

Sometimes behavior doesn't fit into Entities or Value Objects. Pure operations may exist in the domain and should therefore
be modeled as such. Domain-Driven-Design propose the Service pattern to model these operations. 

It is important to strike a balance between modeling all behavior inside objects and modeling all behavior as Services. 
Complex operations can easily muddle the conceptual clarity of simple objects and, when applying on many different domain 
objects at once, blur the responsibility between them. On the other hand, using Services exclusively can lead to an 
[Anemic Domain Model](../anemic-domain-model), which is equally something to avoid.
 
# Characteristics

A domain Service should have the following characteristics:

* The operation relates to a domain concept that don't fit naturally in an Entity or a Value Object.
* The interface is defined by other elements of the model (parameters and returns values are domain model objects).
* The operation is stateless.

Stateless operation doesn't mean that the Service cannot change the system global state. In fact it can have side effects,
such as persisting an object. But it doesn't maintain a state on its own that could affect its behavior.
 
# Other types of services

There are other types of Services as well, addressing different purposes in the system:
 
* Application Services orchestrate domain operations to realize the system use cases.
* Interface Service contain presentation logic.
* Infrastructure Services encapsulate technical operations.

These types of Services also model stateless operations but in other parts (layers) of the application.



