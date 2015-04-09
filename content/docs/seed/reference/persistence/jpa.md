---
title: "JPA persistence"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedPersistence"
tags:
    - "maven"
    - "persistence"
    - "jpa"
    - "configuration"
    - "jndi"
    - "transactions"
menu:
    SeedPersistence:
        weight: 30
---

# Introduction

SEED JPA persistence support enables your application to interface with any relational database through a JPA-compliant
ORM. Note that :

* This version doesn't enforce a specific JPA version. It is currently tested with JPA 1.0 and JPA 2.0.
* This support doesn't specify any ORM implementation. 

Nevertheless, **we do recommend to use latest available Hibernate version**. Some specific situations may require
another version or even another implementation. To add Hibernate to your application module, use the following
Maven dependency:

    <dependency>
        <groupId>org.hibernate</groupId>
        <artifactId>hibernate-core</artifactId>
        <version>...</version>
    </dependency>
    <dependency>
        <groupId>org.hibernate</groupId>
        <artifactId>hibernate-entitymanager</artifactId>
        <version>...</version>
    </dependency>

Add following dependency to declare entity classes in another module that does not have the hibernate dependency:

     <dependency>
         <groupId>org.apache.geronimo.specs</groupId>
         <artifactId>geronimo-jpa_2.0_spec</artifactId>
         <version>1.1</version>
         <scope>provided</scope>
     </dependency>

# Configuration

There are two distinct configurations to consider in your project: the `persistence.xml` file which is specific to JPA, and
the SEED support configuration.

## persistence.xml file

This file has to be placed under the `META-INF` directory of your classpath (for instance in `src/main/resources/META-INF`).
Below snippet is a minimalist `persistence.xml` file example declaring :

* the JPA version (ie. 2.0)
* a unit named `myJpaUnit` 
* a local transaction type (`RESOURCE_LOCAL`) 
* the list of persistence classes to map

    <persistence xmlns="http://java.sun.com/xml/ns/persistence"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd"
        version="2.0">

        <persistence-unit name="myJpaUnit" transaction-type="RESOURCE_LOCAL">
            <class>org.seedstack.seed.persistence.jpa.sample.Item1</class>
            <properties>
                <property name="..." value="..."/>
            </properties>
        </persistence-unit>
    </persistence>


You can declare as many units as required in `persistence.xml` file. You can also add configuration properties directly in this file as long as 
they do not need to be changed again in your application. In order to externalize properties, declare them in SEED configuration instead (see next paragraph).

## SEED configuration

Declare your list of JPA units in order to have them managed by SEED:

    org.seedstack.seed.persistence.jpa.units = myJpaUnit, ...

Add properties to your JPA unit by specifying a section as follows:

    [org.seedstack.seed.persistence.jpa.unit.myJpaUnit]
    property.javax.persistence.jdbc.driver = ...
    property.javax.persistence.jdbc.url = ...
    property.javax.persistence.jdbc.user = ...
    property.javax.persistence.jdbc.password = ...

Any feature of the SEED configuration such as profiles, macros or environment variables are available to configure
your JPA units. For more detail, refer to the [dedicated documentation](#!/seed-doc/core/configuration).

## Using JNDI

Instead of using application specific properties to configure your data source, you can provide one via JNDI by adding following line to the JPA unit definition:

    <non-jta-data-source>java:comp/env/jdbc/my-datasource</non-jta-data-source>

In case of a JTA data source, use following line instead:

    <jta-data-source>java:comp/env/jdbc/my-datasource</jta-data-source>

In case of a Web application, add the following JNDI reference in your `web.xml` file:

    <resource-ref>
        <res-ref-name>jdbc/my-datasource</res-ref-name>
        <res-type>javax.sql.DataSource</res-type>
        <res-auth>Container</res-auth>
    </resource-ref>

You may have to add additional files depending on your Web container. Please refer to the the dedicated container documentation.

# Entities

JPA entities are classes declared in `<persistence-unit>`/`<class>` tags inside the `persistence.xml` file. They all have to be be annotated with JPA annotations
to define the mappings. This subject is not documented here but you can refer to this [detailed tutorial](http://docs.oracle.com/javaee/6/tutorial/doc/bnbpz.html).

# Entity Manager

To use the Entity Manager in your code, simply inject it:

    public class MyRepository {

        @Inject
        private EntityManager entityManager;

        ...
    }

All JPA interactions have to be realized inside a transaction. Refer to the Transaction support [documentation](#!/seed-doc/transaction) for more detail. 
Below is an example using the annotation-based transaction demarcation (notice the `persistence.xml` unit name in `@JpaUnit` annotation)

    public class MyService {

        @Inject
        private MyRepository myRepository;

        @Transactional
        @JpaUnit("myJpaUnit")
        public void doSomethingRelational() {

        }
    }

Unit name is not required if only one JPA unit is configured (ie. use `@JpaUnit()`). 
Nevertheless, be aware that adding a new JPA unit will require to update all such annotations
with the unit name value as the support can not identify the appropriate unit automatically.

When only one JPA unit and one transactional support are defined in your project, the annotation is not necessary as
the transaction support will automatically choose the only transaction handler present in your classpath and the JPA
support will automatically choose the only configured JPA unit. Again, be aware that this implicit configuration will require 
an  update  whole project if you add another JPA unit (see the previous paragraph) or if you add a new transactional
support (such as JMS).

**To remain as future-proof as possible, it is recommended to always explicitly specify JPA units in `@JpaUnit` annotation.**

# Downgrade to JPA 1.0

If JPA 1.0 is required instead of JPA 2.0, the following has to be done:

Make sure `persistence.xml` file version is 1.0:

    <persistence xmlns="http://java.sun.com/xml/ns/persistence"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_1_0.xsd"
        version="1.0">

Use an Hibernate version still compatible with JPA 1.0 (ie. until version 3.3.2.GA) or another compatible ORM:

     <dependency>
             <groupId>org.hibernate</groupId>
             <artifactId>hibernate-core</artifactId>
             <version>3.3.2.GA</version>
     </dependency>
     <dependency>
             <groupId>org.hibernate</groupId>
             <artifactId>hibernate-entitymanager</artifactId>
             <version>3.3.2.GA</version>
     </dependency>

Provide the right JPA API version if your classes are in a different module:

    <dependency>
        <groupId>org.hibernate.javax.persistence</groupId>
        <artifactId>hibernate-jpa-2.0-api</artifactId>
        <scope>provided</scope>
    </dependency>

