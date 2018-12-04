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
        personRepository.addOrUpdate(create("bill.evans@some.org", "Bill", "EVANS"));
        personRepository.addOrUpdate(create("ella.fitzgerald@some.org", "Ella", "FITZGERALD"));
        personRepository.addOrUpdate(create("miles.davis@some.org", "Miles", "DAVIS"));
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
`HelloResource`. We will combine it with the service we defined [before]({{< ref "docs/basics/business.md#the-greeter-service" >}}):

```java
package org.generated.project.interfaces.rest;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.generated.project.domain.model.person.Person;
import org.generated.project.domain.model.person.PersonId;
import org.generated.project.domain.services.GreeterService;
import org.seedstack.business.domain.Repository;
import org.seedstack.business.util.inmemory.InMemory;

@Path("hello")
public class HelloResource {
    @Inject
    @InMemory
    private Repository<Person, PersonId> personRepository;
    @Inject
    private GreeterService greeterService;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return personRepository.get(new PersonId("bill.evans@some.org"))
                .map(greeterService::greet)
                .orElseThrow(NotFoundException::new);
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

We can now inject this custom interface in the `HelloResource` class instead of the default repository:

```java
package org.generated.project.interfaces.rest;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.generated.project.domain.model.person.PersonRepository;
import org.generated.project.domain.services.GreeterService;
import org.seedstack.business.util.inmemory.InMemory;

@Path("hello")
public class HelloResource {
    @Inject
    @InMemory
    private PersonRepository personRepository;
    @Inject
    private GreeterService greeterService;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return personRepository.findByName("ella")
                .findFirst()
                .map(greeterService::greet)
                .orElseThrow(NotFoundException::new);
    }
}
```

{{% callout warning %}}
For now, hot-reloading (with `seedstack:watch`) doesn't play well with the dynamic implementation generated for
a repository without explicit implementation. 

If you wish to make changes to the `PersonRepository`, you'll have to restart the watch process manually.
{{% /callout %}}

## Switch to JPA persistence

To demonstrate that, with the code above, we have true independence from database technology, let's switch to a JPA
based persistence layer.

{{% callout warning %}}
As we will add new dependencies and some configuration, **the application must be stopped**.
{{% /callout %}}

### Dependencies

Add the SeedStack [JPA add-on]({{< ref "addons/jpa/index.md" >}}%):

{{< dependency g="org.seedstack.addons.jpa" a="jpa" >}}

Then add an implementation of the JPA standard like [Hibernate](http://hibernate.org/):

{{< dependency g="org.hibernate" a="hibernate-entitymanager" v="5.3.7.Final" >}}

Hibernate requires the following dependency if you're using Java 9 or more recent:

{{< dependency g="javax.xml.bind" a="jaxb-api" v="2.3.0" >}}

Then add an in-memory capable database like [HyperSQL](http://hsqldb.org/):

{{< dependency g="org.hsqldb" a="hsqldb" v="2.4.1" >}}

{{% callout tips %}}
To connect to an external database, you would add its JDBC driver dependency instead.  
{{% /callout %}}

### Configure a database

JPA is structured around the concept of **"persistence units"**. We have to configure at least one unit to use JPA and such unit needs
a JDBC datasource to work with. Add the following configuration in the `application.yaml` file:

```yaml
jdbc:
  datasources:
    myDatasource:
      url: jdbc:hsqldb:mem:mydb
```

The configuration above will declare a JDBC datasource named `myDatasource` pointing to an auto-created, in-memory, 
H2 database. Now declare a JPA unit using this datasource:

```yaml
jpa:
  units:
    myUnit:
      datasource: myDatasource
      properties:
        hibernate.dialect: org.hibernate.dialect.HSQLDialect
        hibernate.hbm2ddl.auto: update
```

The configuration above will declare a JPA unit named `myUnit`, referencing our datasource. 

{{% callout info %}}
The properties are here to configure Hibernate, our JPA provider and are specific to it. Their role here is to tell 
Hibernate what SQL dialect should be used and that we need the tables to be created or updated on startup.
{{% /callout %}}

### Add the JPA annotations

JPA entities must be mapped to a relational model. While this can be done through XML mapping files, a simpler way is
to annotate the classes.

The PersonId class becomes:

```java
package org.generated.project.domain.model.person;

import javax.persistence.Embeddable;
import org.seedstack.business.domain.BaseValueObject;

@Embeddable
public class PersonId extends BaseValueObject {
    private String email;

    private PersonId() {
        // needed for Hibernate
    }

    public PersonId(String email) {
        this.email = email;
    }

    // ...
}
```

The Person class becomes:

```java
package org.generated.project.domain.model.person;
 
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import org.seedstack.business.domain.BaseAggregateRoot;

@Entity
public class Person extends BaseAggregateRoot<PersonId> {
    @EmbeddedId
    private PersonId id;
    private String firstName;
    private String lastName;

    private Person() {
        // needed for Hibernate
    }
 
    public Person(PersonId id) {
        this.id = id;
    }
 
    // ...
}
```

{{% callout info %}}
Note that we also added a private no-arg constructor to allow Hibernate to instantiate the classes.
{{% /callout %}}

### Change the qualifiers

Now just replace the {{< java "org.seedstack.business.util.inmemory.InMemory" "@" >}} injection qualifier with
the {{< java "org.seedstack.jpa.Jpa" "@" >}} qualifier common from the JPA add-on. This will tell SeedStack to choose
a JPA-based implementation (also provided by the add-on) for injection instead of the in-memory one.

Let's start with the `SampleDataGenerator` qualifier:

```java
public class SampleDataGenerator implements LifecycleListener {
    @Inject
    @InMemory
    private Repository<Person, PersonId> personRepository;
    
    // ...
}
```

Becomes:

```java
public class SampleDataGenerator implements LifecycleListener {
    @Inject
    @Jpa
    private Repository<Person, PersonId> personRepository;
    
    // ...
}
```

Then the HelloResource class:

```java
@Path("hello")
public class HelloResource {
    @Inject
    @InMemory
    private PersonRepository personRepository;
    
    // ...
}
```

Becomes:

```java
@Path("hello")
public class HelloResource {
    @Inject
    @Jpa
    private PersonRepository personRepository;
    
    // ...
}
```

### Declare a transaction

**JPA database work should be done in a transaction.** A good place to start and end a transaction would be on an application
service that orchestrates all the needed operations for a particular use-case. We don't have such a service in our little
tutorial, so we will put the transaction on the `hello()` method of our REST resource.

Two annotations are needed here:

* The {{< java "org.seedstack.seed.transaction.Transactional" "@" >}} annotation to declare the transaction boundaries,
* And the {{< java "org.seedstack.jpa.JpaUnit" "@" >}} annotation to declare on which resource the transaction should be
done. 

In the `HelloResource` class:

```java
@Path("hello")
public class HelloResource {
    // ...

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Transactional
    @JpaUnit("myUnit")
    public String hello() {
        // ...
    }
}
```

And in the `SampleDataGenerator` class: 

```java
public class SampleDataGenerator implements LifecycleListener {
    /// ...
 
    @Override
    @Transactional
    @JpaUnit("myUnit")
    public void started() {
        // ...
    }
    
    // ...
}
```

### Run the application again

Startup the application again by issuing the following command:

```bash
mvn seedstack:watch
```

You can now see that the `/hello` REST endpoint shows the same behavior as before but backed by JPA persistence. **You
can see the JPA subsystem being initialized in the application startup logs.**

### What happened ?

Business-framework compatible persistence add-ons (like [JPA]({{< ref "addons/jpa/index.md" >}}) or [MongoDB]({{< ref "addons/mongodb/index.md" >}}))
each provide:
 
* An implementation for all standard operations for repositories. 
* The ability to translate a domain specification into the corresponding technology-specific query. 

Both are used here, behind the scenes. The specification used in the `findByName()` method gets translated into a JPA 
criteria query, turned then by Hibernate into the proper SQL query. **The results are available as a {{< java "java.util.stream.Stream" >}}
of domain objects, loaded dynamically from the database as they are consumed.**

## Now what ?

### What we learned

In this page you have learned:

* How to execute code at application startup, here to create sample data,
* How to use the default repository implementation without writing any code,
* How to write a technology-agnostic custom query with a specification,
* How to configure and use an in-memory database with JPA and hibernate.

{{% callout ref %}}
If you want to go further on the topic of persistence, see what you can read about [repositories]({{< ref "docs/business/repositories.md" >}})
and [specifications]({{< ref "docs/business/specifications.md" >}}).

You can also explore SeedStack [persistence add-ons]({{< baseUrl >}}addons) documentation: [JDBC]({{< ref "addons/jdbc/index.md" >}}), 
[JPA]({{< ref "addons/jpa/index.md" >}}), [MongoDB]({{< ref "addons/mongodb/index.md" >}}), etc...   
{{% /callout %}}

### Troubleshooting

If you can't get this to work, check the [troubleshooting page]({{< ref "docs/basics/troubleshooting.md" >}}).

### Next step

If you want to learn more, continue on the tutorial on [REST API]({{< ref "docs/basics/rest.md" >}}).
