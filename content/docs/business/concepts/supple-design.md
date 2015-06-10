---
title: "Supple design"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 40
---

> The ultimate purpose of software is to serve users. But first, that
> same software has to serve developers. [Eric Evans]

A software is not a piece code writen in a one shot sprint. It is
project that evolves. A lot of developers will have to work on it, to
refactor it or add new features. Supple design is about making it
a pleasure. It should invite to change and avoid the maintenance hell.

Complex and monolithic methods make hard to refactor or reuse parts of
the code. When developers are not confident about what the software
does, they start duplicating code. When this happens, iterative
process and refactoring stops.

A supple design reveals the intent of the design. Side effects should
contained and easy to predict. Behaviour should be obvious making it
easy to reason about without having to investigate the implementation.

There is no one-way to achieve this suppleness but Eric Evans provides
us some clues with a set of patterns. We will try to define and
illustrate them.

## Intention-Revealing Interface

This concept is all about communication between developers through
code. Names of classes and methods should describe intents instead of
means. The *ubiquitous language* must be used to define these
names. It will improves the comprehension of the code by the other
members of the team.

> If a developer must consider the implementation of a component in
> order to use it, the value of encapsulation is lost.

Implementation changes should not affect the expected behaviour.

You can also make methods signatures clearer using meaningful Value
Objects and Entities rather than primitives and associated classes
(eg. String, long, BigDecimal, etc.). For instance, given the
following method:

    void setAddress(String address)

How the client developer can know what the address should look like ?
Does the model allow to change the address or is it just for
initialization purpose ? Using the concept of *Intention-Revealing
Interface* will leads us to this newer version of the method:

    void changeAddress(Address address)

## Side-Effect-Free Function

We just explained how a good naming can improve the comprehension of a
model, but this is not always enougth. Complex methods usually call a
combination of other methods. When all these nested methods have
side-effects, it become hard to predict the overall behaviour.

>In computer science side-effect means any modification in the state of
>a system.

Lets say we are working on a software managing teams. We had to
implement a method allowing to merged teams. So we first wrote this:

    teamOne.add(teamTwo)

Ok, it takes members of the *teamTwo* and add them to the
*teamOne*. It does the job. Wait ! What happens to *teamTwo* ? Has it
been modified also ? We can't be sure whithout looking at the code of
the *add* method because this method is not *side-effect-free*. After
refactoring the code, here is the second version:

    Team newTeam = teamOne.mergeWith(teamTwo)

In the newer version, *teamOne* and *teamTwo* are not
modified. Instead we create a new object, like that developers don't
have to understand the implementation. The knowledge is capture in the
newly created team. The idea here is not to remove all the
side-effects otherwise the code will just allow you to perform
queries. But side-effects should be contained in small entities
methods and complex computation isoltated in value objects.

## Assertion

In the previous section we talk about limiting side-effects. But some
of them will remains. The problem is that when they are implicit, it becomes
impossible to anticipate the changes on the state of the application
whithout following the execution path. Which breaks the
encapsulation. So in order to make them explicit use *assertions*. It
can be done using method post-condition (for instance, with `@Valid` from the
Validation JSR) or by using unit tests.

## Going further

In this article, we described methods for making intentions explicit
using *Intention-Revealing Interface*, *Side-Effect-Free Functions*
and *Assertion*. These methods allow us to communicate intents,
protecting encapsulation. This is very important if we want to keep
the advantages of using a *Object-oriented-language*. It also allow
the client developer to focus on his design instead of having
understand all the inner workings of the API he uses.

In his book "Domain Driven Design", Eric Evans go further describing
three additional concepts: *Conceptual contour*, *Standalone*,
*Closure of Operations*. I invite you to read his book if you want to
have all the tools to reach the suppleness.

