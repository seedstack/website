---
title: "Domain model"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 20
---

Eric Evans in his book introducing the *Domain driven design* presents
a set of building blocks to help design a domain-model. We will introduced
them here.

# Entity

Often DDD beginners have a tendency to focus more on data than on the
software. This often leads in all the concepts of the "domain" being
coded as entities. Specially, in anemic entities using only getters
and setters. Using them is not wrong but it's not enough to hold the
insights of a domain. That's why designing entities should be taken
very carefully.

The entity concept should be used for an element of your domain when
you take care of its identity. An identity must be unique and
immutable. Even it an object can change during its lifetime, its
identity must stay untouched. If this is not true for your element,
you should consider using a value object.

When designing an entity, the critical part is to determine what is
the identity and how to create it. An identity can be hold by a set of
properties. In this case, a value object can be well fitted to
guaranty the identity consistency and immutability.

There are different kind of creation strategies for identities:

* The client can pass values handling himself the uniqueness.
* The application can generate the identity using an algorithm.
* The application can rely on an external identity generator, like a database sequence.

The first case is easily handled using factories. The other cases,
can be usually more complicated, but the Business framework provides an API
for them. See [Identity management](/docs/business/manual/factory/identity/).

{{% callout info %}}
A bad practice we have seen many times, is the overuse of
inheritance. It should be used with parsimony, only when it really
means something in terms of the domain-model. It should never be
used to factorized technical code. If you have do it maybe means
that you should rethink your model.
{{% /callout %}}

# Value Object

As we said above, the usage of value objects is often neglected
compared to entities. So what is a value object ? It's an immutable
object expressing the meanings of the attributes it contains. A common
example is Name or Address:

```java
public class Name {

    private final String firstName;
    private final String middleName;
    private final String lastName;

    public Name(String firstName, String middleName, String lastName) { ... }

    /* Getters */
    public String firstName() { ... }
    public String middleName() { ... }
    public String lastName() { ... }

    /* Notice that there is no setters to respect the immutability */
}
```

# Aggregate

# Factory

# Repository

# Service

Important domain operations can't always be placed naturally in an Entity or Value Object. They are standalone activities or actions, expressed by a verb instead of a noun. These operations are candidates to fit into a Service. A service is defined by what it can do for a client. It should have a well-defined responsibility, expressed in its name and its interface. Its operations should come from the {{< term "ubiquitous language" >}} or be introduced into it. Parameters and return values should be domain objects. A good service has three characteristics:

1. The operation is related to a domain concept that does not fit naturally in an Entity or Value Object.
2. The interface is defined in terms of other elements of the domain.
3. The operation is stateless.

A service statelesness doesn't mean that it cannot change the application global state (that is, it may have side effects). But it doesn't hold state of its own that could affect its behavior.

# Domain event

# Policy
