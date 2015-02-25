---
title: "Domain layer"
type: "home"
layout: "business-content"
menu:
    BusinessConcepts:
        weight: 30
---


SEED Business Framework brings building blocks and tools to help you design your domain but the first piece to build a domain is a plan of it (no building is built without a plan), that is the model.

> A **domain** is as useful as an empty building or hotel before any employee or client comes in. It might be well designed with rules and expected behaviours but only makes sense once people come in. At the same time, running a business (that's the **application** it has been designed for) in an hotel or being a client would not be possible - or enjoyable - without the forethought design put in that building. Furthermore, modifications of a building while it is in use are usually less than welcome and frustrating unless they were planned or made possible beforehand. 

In brief:

- The domain is a mirror of the actual Business knowledge that has to be manipulated by the [application](#!/business-doc/understanding-ddd/application-layer).
- The domain [model](#!/business-doc/understanding-ddd/domain-layer#model) abstraction allows the development team to express the domain within their code.
- A domain cannot do anything on its own but it does contain objects, rules and behaviour than can be expressed. As such, it is the foundation of the application and can easily be tested.

# Design guidelines

There is no specific way to get an insightful model that abstracts and represents your business. But here are some guidelines:

- get to know the vocabulary and meaning of [DDD](#!/business-doc/understanding-ddd#introduction) Model Design
- follow the [requirements](#!/business-doc/requirements) (ie. ubiquitous language, iterative process, etc)
- the model can take the form of a class diagram, an image, a mind map, just plain text... - a combination of those
- the model has to use representations and vocabulary that make sense from the product owner to the development team
- your model evolves as your business (whether by expansion or precision)
- when the model gets too big, a "context map" can define coherent "sub-parts" and interfaces
- "sub-parts" are bounded contexts but not only (eg. a specific functionality implying technical complexity can/should have its own context - such as indexing, storage)

Some resources:

- [Sub-domains and Bounded Contexts in Domain-Driven Design (DDD)](http://gorodinski.com/blog/2013/04/29/sub-domains-and-bounded-contexts-in-domain-driven-design-ddd)
- [BoundedContext](http://martinfowler.com/bliki/BoundedContext.html) by Martin Fowler

# Entity

- An entity is an object with a **strong identity**. 
- It is **mutable** and its life cycle goes beyond the life of the system (eg. persistence, cross-application).
- An entity is often *Persistent*.

Example: a car is usually clearly identified in a system

# Aggregate

- Aggregates are groups of objects that belong together. 
- The **Aggregate Root** is the object that holds them all together and gives an identity yo the aggregate.
- The **Aggregate Root** guarantees the consistency of changes being made within the aggregate by forbidding external objects from holding references to its members.
- Each Aggregate is treated as a "single unit" for persistence purposes.

> Note : an entity is the smallest possible aggregate.

## Example 

![aggregates](/img/business/aggregates.png)

## Some rules about aggregates

- An aggregate is a module that insures a functional cohesion
- It has an entity as root element named "Aggregate Root"
- It contains a set of well bounded entities and value objects
- No strong references between aggregates, only "ids" are linked
- The "Aggregate Root" is responsible for maintaining the invariants
- There can be inconsistencies between aggregates 
- Entities only hold references to its "Aggregate Root"
- Every entity of an aggregate (including its aggregate root) can only hold 
a reference to another aggregate through its own aggregate root.

## Typologies

SEED Business Framework is designed to address different typologies of aggregates as illustrated below:

Here is some illustrated typologies:

1. each entity is an aggregate
2. aggregates made of some entities
3. huge aggregates

![aggregates](/img/business/aggregates-typologies.png)

# Factory

- Creating an aggregate is the responsibility of a factory. 
- The factory creates the root of the aggregate and all the contained objects with all necessary rules and checks
- The creation is **atomic**. 
- **It is purely a domain logic**.

> A factory may use *Tuples* as parameters.

# Repository

- A repository is used to prevent coupling domain and persistence. 
- It encapsulates the logic to obtain an aggregate reference via their root.
- A repository has simple methods like `load()`, `delete()`, `save()`, `persist()`. 

> The repository interface is indeed part of the domain layer as a design contract defining how to manipulate an aggregate in the domain. 
> Nevertheless its implementation is most certainly part of infrastructure layer (dealing with persistence).

# Value Object

- Value objects have **no** particular **identity** and are immutable. 
- They are used to store generic information and behaviour like an address, a customer id, a phone number... 
- Recurrent concerns about such objects (validation of a phone number, localization of a code area) can be located in such objects.

Example : A car identity ([VIN](#!/business-doc/hands-on-domain#example-2---vin)) is unique and defined by its properties.

> Power Use of Value Objects, see this video: [http://www.infoq.com/presentations/Value-Objects-Dan-Bergh-Johnsson](http://www.infoq.com/presentations/Value-Objects-Dan-Bergh-Johnsson)

# Domain Service

- A Service is a responsibility that does not belong to an entity or a value object. A service is **stateless** !
- A domain service only involves domain logic. The logic can be reused across many applications. 

Example: a bank account transfer.

> A service often belongs to the application layer but if the expected behaviour belongs to the domain and should be reusable, it can be defined within the domain layer or its interface alone (in order to be implemented accordingly in the application layer).

# Putting it all together

![all-together](/img/business/all-domain.png)

# Other patterns

## Policy (Strategy)

- A policy is used to prevent code redundancy and coupling
- It provides reusable logic to validate objects, compute data (and so on) across layers
- Examples : 

	- `TaxPolicy` with a `Money computeTaxAmount(Money amount, Area area)` method
	- `RoutePolicy` with a `List<Steps> getRoute(PlaceAndTime start, PlaceAndTime end)` method and different possible implementations (fastest, shortest, cheapest)

> Policy is a design pattern that rather belongs to the domain although it might (temporarily) define and enlarge the domain behaviour within other layers. SEED Business Framework provides a `@DomainPolicy` annotation that can be used outside of the domain. Nevertheless it should be used appropriately: 1) it should most probably bring some behaviour back into the the domain even it was first written outside of it. 2) if the code is really not part of the domain, consider another pattern or not using a domain specific annotation.

## Events

- An event is basically a message stating that "something" just happened (eg. receiving a new order in a store, a failure notice, this patient got checked up)
- Observer pattern : events allow handlers/listeners/observers to subscribe to them in order to trigger some behaviour
- Example : an online store submitted order - the application persists the [Order Aggregate](#!/business-doc/hands-on-domain#basejpaaggregateroot) and an event is sent ([provided by SEED Business Framework](#!/business-doc/build-domain/using-events#provided-events)). The event handler checks if the order contains any specific item that requires some specific treatments (eg. an object customisation request - planning an appointment) 
