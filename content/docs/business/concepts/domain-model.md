---
title: "Domain model"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 10
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
* The application can generate the identity using an algorithm
* The application can rely on the database, e.g. using Oracle sequence

The first case is easily handle using factories. The other cases,
can be usually more complicated, but the Business framework provides an API
for them. See [Identity management](/docs/business/manual/factory/).

{{% callout info %}}
A bad practice we have seen many times, is the overuse of
inheritance. It should be used with parsimony, only when it really
means something in terms of the domain-model. It should never be
used to factorized technical code. If you have do it maybe means
that you should rethink your model.
{{% /callout %}}

# Value Object

As we said earlier, the usage of value object is often neglect
compared to entities. So what is a value object ? It's an immutable
object expressing the meanings of the attributes it contains. A common
example is Name or Address:

```java
public class Name {

    private String firstName;
    private String middleName;
    private String lastName;

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

# Domain event

# Policy
