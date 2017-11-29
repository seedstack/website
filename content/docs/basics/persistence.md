---
title: "Persistence"
type: "home"
zones:
    - "Docs"
tags:
    - domain-driven design
    - persistence
    - tutorial
menu:
    docs:
        parent: "basics"
        weight: 5
---

Now that we have a domain model, we would like to use some persistence with it. In Domain-Driven Design, persistence is
done with [Repositories]({{< ref "docs/business/repositories.md" >}}) which work on whole aggregates.

## We need some data first!

To be able to test this, we need some sample data. A class implementing {{< java "org.seedstack.seed.LifecycleListener" >}}
will provide the opportunity to insert data at application startup.

In the package `infrastructure`, create a `SampleDataGenerator` class:  

```java
package org.generated.project.infrastructure;

import javax.inject.Inject;
import org.generated.project.domain.model.person.Person;
import org.generated.project.domain.model.person.PersonId;
import org.seedstack.business.domain.Repository;
import org.seedstack.business.util.inmemory.InMemory;
import org.seedstack.seed.LifecycleListener;

public class SampleDataGenerator implements LifecycleListener {
    @Inject
    @InMemory
    private Repository<Person, PersonId> personRepository;

    @Override
    public void started() {
        personRepository.add(create("bill.evans@some.org", "Bill", "EVANS"));
        personRepository.add(create("ella.fitzgerald@some.org", "Ella", "FITZGERALD"));
        personRepository.add(create("miles.davis@some.org", "Miles", "DAVIS"));
    }

    private Person create(String email, String firstName, String lastName) {
        Person person = new Person(new PersonId(email));
        person.changeName(firstName, lastName);
        return person;
    }
}
```  


## The default repository

As we don't want to write unnecessary code, we will use a default repository implementation of SeedStack. 

To do that, just inject the parameterized {{< java "org.seedstack.business.domain.Repository" >}} interface in your 
`HelloResource`:

```java
package org.generated.project.interfaces.rest;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.generated.project.domain.model.person.Person;
import org.generated.project.domain.model.person.PersonId;
import org.seedstack.business.domain.Repository;
import org.seedstack.business.util.inmemory.InMemory;

@Path("hello")
public class HelloResource {
    @Inject
    @InMemory
    private Repository<Person, PersonId> personRepository;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return String.format("Hello %s!",
                personRepository.get(new PersonId("bill.evans@some.org"))
                        .map(Person::getFirstName)
                        .orElse("unknown")
        );
    }
}
```

{{% callout info %}}
Multiple repository implementations can co-exist, so we need to choose one by qualifying the injection point. An **in-memory**
implementation is enough for now, so we use the {{< java "org.seedstack.business.util.inmemory.InMemory" "@" >}}
qualifier.
{{% /callout %}}

## Custom query

As business needs evolve, you will surely need to implement custom queries to retrieve aggregates. 

With SeedStack, you can build **custom queries on the object model**, regardless of the persistence implementation. This
is done in a custom repository interface, with a [specification]({{< ref "docs/business/specifications.md" >}}).

In the `domain.model.person` package, create the `PersonRepository` interface, extending {{< java "org.seedstack.business.domain.Repository" >}} :

```java
package org.generated.project.domain.model.person;

import java.util.stream.Stream;
import org.seedstack.business.domain.Repository;

public interface PersonRepository extends Repository<Person, PersonId> {
    default Stream<Person> findByName(String name) {
        return get(getSpecificationBuilder().of(Person.class)
                .property("firstName").matching(name).ignoringCase()
                .or()
                .property("lastName").matching(name).ignoringCase()
                .build()
        );
    }
}
```

We can now inject this custom interface in the `HelloResource` class:

```java
package org.generated.project.interfaces.rest;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.generated.project.domain.model.person.Person;
import org.generated.project.domain.model.person.PersonRepository;
import org.seedstack.business.util.inmemory.InMemory;

@Path("hello")
public class HelloResource {
    @Inject
    @InMemory
    private PersonRepository personRepository;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return String.format("Hello %s!",
                personRepository.findByName("bill")
                        .findFirst()
                        .map(Person::getFirstName)
                        .orElse("unknown")
        );
    }
}
```

## Now what ?

### What we learned

In this page you have learned:

* How to execute code at application startup, here to create sample data,
* How to use the default repository implementation without writing any code,
* How to write a technology-agnostic custom query with a specification.

{{% callout ref %}}
If you want to go further on the topic of persistence, see what you can do with [Repositories]({{< ref "docs/business/repositories.md" >}})
and [specifications]({{< ref "docs/business/specifications.md" >}}).

You can also explore SeedStack [persistence add-ons]({{< baseUrl >}}addons) to connect to real databases: [JDBC]({{< ref "addons/jdbc/index.md" >}}), 
[JPA]({{< ref "addons/jpa/index.md" >}}), [MongoDB]({{< ref "addons/mongodb/index.md" >}}), etc...   
{{% /callout %}}

### Troubleshooting

If you can't get this to work, check the [troubleshooting page]({{< ref "docs/basics/troubleshooting.md" >}}).

### Next step

If you want to learn more, continue on the tutorial on [REST API]({{< ref "docs/basics/rest.md" >}}).
