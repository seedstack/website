---
title: "JPA, step-by-step"
description: "Learn to configure and use JPA with SeedStack."
author: "Adrien LAUER"
date: 2018-09-11
tags:
    - persistence
zones:
    - Guides
noMenu: true
---

This guide details step-by-step how to configure JPA in SeedStack, to access an existing relational database.<!--more-->

## Step 1: The dependencies

### JPA add-on

First, add the SeedStack JPA add-on:

{{< dependency g="org.seedstack.addons.jpa" a="jpa" >}}

### JPA provider

Beyond the JPA add-on, an actual JPA implementation, called a JPA provider, is required: 

{{% tabs list="Hibernate|EclipseLink" %}}
{{% tab "Hibernate" true %}}
Hibernate is a very popular JPA implementation. When using Hibernate, SeedStack is able to stream results from the database 
without putting them all in memory (useful when retrieving for result sets).

{{< dependency g="org.hibernate" a="hibernate-entitymanager">}}
{{% /tab %}}
{{% tab "EclipseLink" %}}
Eclipse link is a also popular and is the reference JPA implementation.

{{< dependency g="org.eclipse.persistence" a="eclipselink">}}
{{% /tab %}}
{{% /tabs %}}

### Connection pooling

If you want connection pooling, you have to add the dependency for one of the following pooling libraries:

{{% tabs list="HikariCP|C3P0|Commons DBCP" %}}
{{% tab "HikariCP" true %}}
{{< dependency g="com.zaxxer" a="HikariCP" >}}
{{% /tab %}}
{{% tab "C3P0" %}}
{{< dependency g="com.mchange" a="c3p0" >}}
{{% /tab %}}
{{% tab "Commons DBCP" %}}
{{< dependency g="org.apache.commons" a="commons-dbcp2" >}}
{{% /tab %}}
{{% /tabs %}} 

### JDBC driver

{{% tabs list="H2 driver|HSQLDB driver|PostgreSQL driver|MariaDB driver|Oracle driver|DB2 driver" %}}
{{% tab "H2 driver" true %}}
{{< dependency g="com.h2database" a="h2" >}}
{{% /tab %}}
{{% tab "HSQLDB driver" %}}
{{< dependency g="org.hsqldb" a="hsqldb" >}}
{{% /tab %}}
{{% tab "PostgreSQL driver" %}}
{{< dependency g="org.postgresql" a="postgresql" >}}
{{% /tab %}}
{{% tab "MariaDB driver" %}}
{{< dependency g="org.mariadb.jdbc" a="mariadb-java-client" >}}
{{% /tab %}}
{{% tab "Oracle driver" %}}
{{< dependency g="com.oracle.jdbc" a="ojdbc8" >}}
{{% /tab %}}
{{% tab "DB2 driver" %}}
The JDBC driver can be obtained from the directory of your DB2 installation. 
{{% /tab %}}
{{% /tabs %}} 

## Step 2: Datasource configuration

JPA relies on a JDBC datasource to access the database. We are now going to configure such datasource through the SeedStack
JDBC add-on (pulled transitively by the JPA add-on):

{{% tabs list="H2 datasource|HSQLDB datasource|PostgreSQL datasource|MariaDB datasource|Oracle datasource|DB2 datasource" %}}
{{% tab "H2 datasource" true %}}
```yaml
jdbc:
  datasources:
    myDatasource:
      provider: org.seedstack.jdbc.internal.datasource.HikariDataSourceProvider
      url: jdbc:h2:mem:mydb
```
{{% /tab %}}
{{% tab "HSQLDB datasource" %}}
```yaml
jdbc:
  datasources:
    myDatasource:
      provider: org.seedstack.jdbc.internal.datasource.HikariDataSourceProvider
      url: jdbc:hsqldb:mem:mydb
```
{{% /tab %}}
{{% tab "PostgreSQL datasource" %}}
```yaml
jdbc:
  datasources:
    myDatasource:
      provider: org.seedstack.jdbc.internal.datasource.HikariDataSourceProvider
      url: jdbc:postgresql://localhost:5740/mydb
```
{{% /tab %}}
{{% tab "MariaDB datasource" %}}
```yaml
jdbc:
  datasources:
    myDatasource:
      provider: org.seedstack.jdbc.internal.datasource.HikariDataSourceProvider
      url: jdbc:mariadb://localhost:3306/mydb
```
{{% /tab %}}
{{% tab "Oracle datasource" %}}
```yaml
jdbc:
  datasources:
    myDatasource:
      provider: org.seedstack.jdbc.internal.datasource.HikariDataSourceProvider
      url: jdbc:oracle:thin:@localhost:1521:mydb
```
{{% /tab %}}
{{% tab "DB2 datasource" %}}
```yaml
jdbc:
  datasources:
    myDatasource:
      provider: org.seedstack.jdbc.internal.datasource.HikariDataSourceProvider
      url: jdbc:db2://localhost:5021/mydb
```
{{% /tab %}}
{{% /tabs %}} 

## Step 3: Unit configuration

JPA organizes persisted classes in buckets called "JPA units". All classes persisted within a JPA unit share a common
datasource and configuration. A local transaction is bound to a JPA unit (it cannot span over multiple units). We are
now going to configure a JPA unit that uses the datasource we specified before:

{{% tabs list="H2 unit|HSQLDB unit|PostgreSQL unit|MariaDB unit|Oracle unit|DB2 unit" %}}
{{% tab "H2 unit" true %}}
```yaml
jpa:
  units:
    myUnit:
      datasource: myDatasource
      properties:
        hibernate.dialect: org.hibernate.dialect.H2Dialect
        hibernate.hbm2ddl.auto: update
```
{{% /tab %}}
{{% tab "HSQLDB unit" %}}
```yaml
jpa:
  units:
    myUnit:
      datasource: myDatasource
      properties:
        hibernate.dialect: org.hibernate.dialect.HSQLDialect
        hibernate.hbm2ddl.auto: update
```
{{% /tab %}}
{{% tab "PostgreSQL unit" %}}
```yaml
jpa:
  units:
    myUnit:
      datasource: myDatasource
      properties:
        hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
        hibernate.hbm2ddl.auto: update
```
{{% /tab %}}
{{% tab "MariaDB unit" %}}
```yaml
jpa:
  units:
    myUnit:
      datasource: myDatasource
      properties:
        hibernate.dialect: org.hibernate.dialect.MariaDB53Dialect
        hibernate.hbm2ddl.auto: update
```
{{% /tab %}}
{{% tab "Oracle unit" %}}
```yaml
jpa:
  units:
    myUnit:
      datasource: myDatasource
      properties:
        hibernate.dialect: org.hibernate.dialect.Oracle12cDialect
        hibernate.hbm2ddl.auto: update
```
{{% /tab %}}
{{% tab "DB2 unit" %}}
```yaml
jpa:
  units:
    myUnit:
      datasource: datasource1
      properties:
        hibernate.dialect: org.hibernate.dialect.DB2Dialect
        hibernate.hbm2ddl.auto: update
```
{{% /tab %}}
{{% /tabs %}} 

## Step 4: Classes configuration

To automatically configure the JPA unit, SeedStack automatically detected persisted class (i.e. JPA entities). However it
needs additional information to associate a particular class to a particular unit. This is done with 
[class configuration]({{< ref "docs/core/configuration.md#class-configuration" >}}):

```yaml
classes:
  org:
    generated:
      project:
        domain:
          model:
            jpaUnit: myUnit
```

Every JPA entity inside the package `org.generated.project.domain.model` and its subpackages will be associated with the
JPA unit `myUnit`.

{{% callout tips %}}
This "tag" can be specified at any package level and an upper-level tag can be overridden by a lower-level tag.              
{{% /callout %}}

## Step 5: Entity definition

Although it is possible to write a plain vanilla JPA entity, we are going to leverage a "Domain-Driven Design" (DDD)
approach by using the [SeedStack business framework]({{< ref "docs/business/index.md" >}}). To do so, we are going
for a very simple DDD-oriented model with a single `customer` aggregate. It models a `Customer` with its identity 
being the `CustomerId` value-object.

The `CustomerId` class: 

```java
package org.generated.project.domain.model.customer;

import javax.persistence.Embeddable;
import org.seedstack.business.domain.BaseValueObject;

@Embeddable
public class CustomerId extends BaseValueObject {

    private String value;

    private CustomerId() {
        // A default constructor is needed by JPA but can be kept private
    }

    public CustomerId(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
```

The `Customer` class: 

```java
package org.generated.project.domain.model.customer;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import org.seedstack.business.domain.BaseAggregateRoot;

@Entity
public class Customer extends BaseAggregateRoot<CustomerId> {
    @EmbeddedId
    private CustomerId id;
    private String firstName;
    private String lastName;
    private String address;
    private String deliveryAddress;
    private String password;

    private Customer() {
        // A default constructor is needed by JPA but can be kept private
    }

    public Customer(CustomerId customerId) {
        this.id = customerId;
    }

    @Override
    public CustomerId getId() {
        return id;
    }
}
```

{{% callout info %}}
Note how this model is first and foremost a DDD-oriented model but with JPA annotations mixed in. The JPA annotations simply
define the model-to-database mapping of the business concepts.
{{% /callout %}}

## Step 6: Repository usage

We have defined a DDD aggregate, so we are going to use a [repository]({{< ref "docs/business/repositories.md" >}})
to store and retrieve it. A repository is a business-oriented encapsulation of the model persistence. 

{{% callout info %}}
The business framework provides a {{< java "org.seedstack.business.domain.Repository" >}} interface, defining basic repository
features. To obtain a default JPA implementation you must qualify the injection point with the {{< java "org.seedstack.jpa.Jpa" "@" >}} 
annotation.
{{% /callout %}}

{{% callout tips %}}
Repositories are often used in [services]({{< ref "docs/business/services.md" >}}) or directly in interface-related 
classes like in REST resources. 
{{% /callout %}}

Let's define a service interface:

```java
@Service
public interface SomeService {
    void doSomething(CustomerId customerId);
}
```

And an implementation using a JPA-capable implementation of the {{< java "org.seedstack.business.domain.Repository" >}} interface:

```java
public class SomeServiceImpl implements SomeService {
    @Inject
    @Jpa
    private Repository<Customer, CustomerId> customerRepository;
    
    @Transactional
    @JpaUnit("myUnit")
    public void doSomething(CustomerId customerId) {
        Customer customer = customerRepository.get(customerId)
                            .orElseThrow(() -> new CustomerNotFoundException(customerId));
        
        // ... do the work
    }
}
```

{{% callout info %}}
JPA database access must be done in a transaction. Note how the {{< java "org.seedstack.seed.transaction.Transactional" "@" >}}
and {{< java "org.seedstack.jpa.JpaUnit" "@" >}} annotations are specified together on the method to mark a JPA transaction
happening on unit `myUnit`. 
{{% /callout %}}

## Bonus: Custom repository

The base operations provided by the {{< java "org.seedstack.business.domain.Repository" >}} interface are useful but 
often not enough, especially if you want to define business-oriented persistence operations for a particular aggregate.

To define a custom repository, an interface is needed:
 
```java
public interface CustomerRepository extends Repository<Customer, CustomerId> { 
    Customer findVipCustomers();
}
```

This custom interface must then be implemented using JPA. The easiest way is to create an implementation class extending
{{< java "org.seedstack.jpa.BaseJpaRepository" >}}. That way, you'll only have to implement your custom methods: 

```java
public class CustomerJpaRepository extends BaseJpaRepository<Customer, CustomerId> 
                                   implements CustomerRepository {
    @Override
    public List<Customer> findVipCustomers() {
        EntityManager entityManager = getEntityManager();
        // do work with entityManager
    }
}
```

To inject your custom implementation, use the custom interface at your injection point:

```java
public class SomeServiceImpl implements SomeService {
    @Inject
    private CustomerRepository customerRepository;
    
    @Transactional
    @JpaUnit("myUnit")
    public void doSomething(CustomerId customerId) {
        List<Customer> vipCustomers = customerRepository.findVipCustomers();
        // ... do the work
    }
}
```
