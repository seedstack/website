---
title: "Business code"
type: "home"
zones:
    - "Docs"
sections:
    - "Manual"    
tags:
    - domain-driven design
    - tutorial
menu:
    docs-manual:
        parent: "basics"
        weight: 4
---

Now it is time to spice up our "Hello World" application with some business code. With SeedStack business framework, it
is easy to write clean and maintainable business code.

## Domain-Driven Design

Domain-Driven Design is a software approach built on the idea of solving business problems through code. This is done
by focusing on the heart of the business logic, to distill a design that can solve business problems.

The business framework helps with the implementation of that domain model. It also provides default implementations 
and helpers to quickly address related needs like model mapping or pagination.
 
But keep in mind that it's up to you to provide a proper model for the business problems you're solving.

{{% callout ref %}}
Read more about the Domain-Driven Design on the [DDD basics page]({{< ref "docs/business/index.md" >}}). 
{{% /callout %}}    

## A trivial domain

We don't want to go into the details of Domain-Driven Design yet, so we will use a trivial domain model with a single
aggregate.

![Hello World model](../img/hello-world-model.png)

Although it is simple, you can already see that:

* The `PersonId` class is a [value object]({{< ref "docs/business/value-objects.md" >}}) that is used as an identifier. 
* The `Person` class is an [entity]({{< ref "docs/business/entities.md" >}}) that act as the root of the `person` aggregate.
* A `changeName()` business-meaningful method is preferred over setters.
* A package materializes the boundary of the `person` [aggregate]({{< ref "docs/business/aggregates.md" >}}).

### The person aggregate

In the `domain.model` package, create a sub-package named `person`. In this sub-package create the `PersonId` value object:

```java
package org.generated.project.domain.model.person;

import org.seedstack.business.domain.BaseValueObject;

public class PersonId extends BaseValueObject {
    private final String email;

    public PersonId(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}
```

Then, in the same package, create the `Person` aggregate root entity:

```java
package org.generated.project.domain.model.person;
 
import org.seedstack.business.domain.BaseAggregateRoot;
 
public class Person extends BaseAggregateRoot<PersonId> {
    private final PersonId id;
    private String firstName;
    private String lastName;
 
    public Person(PersonId id) {
        this.id = id;
    }
 
    @Override
    public PersonId getId() {
        return id;
    }
 
    public String getFirstName() {
        return firstName;
    }
 
    public String getLastName() {
        return lastName;
    }
 
    public void changeName(String firstName, String lastName) {
        if (firstName == null || firstName.isEmpty()) {
            throw new IllegalArgumentException("First name is missing");
        }
        if (lastName == null || lastName.isEmpty()) {
            throw new IllegalArgumentException("Last name is missing");
        }
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
```

### The greeter service

We will now create a service that greets a person. In the `domain.services` package, create the `Greeter` service interface:

```java
package org.generated.project.domain.services;

import org.generated.project.domain.model.person.Person;
import org.seedstack.business.Service;

@Service
public interface GreeterService {
    String greet(Person person);
}
```

Then, in the same package, create the `DefaultGreeterService` implementation:

```java
package org.generated.project.domain.services;

import org.generated.project.domain.model.person.Person;

public class DefaultGreeterService implements GreeterService {
    @Override
    public String greet(Person person) {
        return String.format(
                "Hello %s %s!",
                person.getFirstName(),
                person.getLastName()
        );
    }
}
```

We can now inject this service in the `HelloResource` class to move the business logic away:

```java
package org.generated.project.interfaces.rest;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.generated.project.domain.model.person.Person;
import org.generated.project.domain.model.person.PersonId;
import org.generated.project.domain.services.GreeterService;

@Path("hello")
public class HelloResource {
    @Inject
    private GreeterService greeterService;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        Person person = new Person(new PersonId("someone@some.org"));
        person.changeName("Robert", "SMITH");
        return greeterService.greet(person);
    }
}
```

## Now what ?

On this page you have learned:

* That Domain-Driven Design is a software approach focused on solving business problems,
* How to write a very simple domain model, 
* How to write a very simple service.

### Troubleshooting

If you can't get this to work, check the [troubleshooting page]({{< ref "docs/basics/troubleshooting.md" >}}).

### Next step

If you want to learn more, continue on the tutorial to learn about [persistence]({{< ref "docs/basics/persistence.md" >}}).
