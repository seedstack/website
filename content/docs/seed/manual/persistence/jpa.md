---
title: "JPA"
type: "manual"
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

Seed JPA persistence support enables your application to interface with any relational database through a JPA-compliant
ORM. Note that:

* This version doesn't enforce a specific JPA version. It is currently tested with JPA 1.0 and JPA 2.0.
* This support doesn't specify any ORM implementation. 

To add Seed JPA persistence support to your project, use the following Maven dependency:

     <dependency>
         <groupId>org.seedstack.seed</groupId>
         <artifactId>seed-persistence-support-jpa</artifactId>
     </dependency>

If you want to use the popular Hibernate ORM, use the following Maven dependency:

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
        <groupId>org.hibernate.javax.persistence</groupId>
        <artifactId>hibernate-jpa-2.0-api</artifactId>
        <version>1.0.1.Final</version>
        <scope>provided</scope>
    </dependency>

# Configuration

There are two ways of configuring the JPA persistence support. 

* Without an explicit `persistence.xml` where Seed will scan all entities in the classpath and compute the persistence
unit(s) information at startup. In this mode, the JDBC connections must be supplied by the Seed JDBC support instead
of being managed internally by the JPA provider.
* With an explicit `persistence.xml` file in which case all JPA initialization is delegated to the provider. There are 
some limitations in this mode, mainly that the `persistence.xml` must list all entity classes and that the choice of 
JNDI or not must be hard-coded in the file.

In any case you must always declare the list of your persistence units in the configuration:

```ini
[org.seedstack.seed.persistence.jpa]
units = my-jpa-unit, ...
```
    
Each unit can then be configured with the following configuration:

```ini
[org.seedstack.seed.persistence.jpa.unit.my-jpa-unit]
...
```

In any mode you can pass set properties on the persistence unit with the following configuration:

```ini
[org.seedstack.seed.persistence.jpa.unit.my-jpa-unit]
property.name.of.the.property1 = value-of-the-property1
property.name.of.the.property2 = value-of-the-property2
...
```

## Without persistence.xml

You must first define a JDBC datasource in the configuration. To do so, please refer to the [JDBC support configuration]
(../jdbc). You can then declare a JPA unit that will refer to this datasource by its name:
 
```ini
[org.seedstack.seed.persistence.jpa.unit.my-jpa-unit]
datasource = my-datasource
```
    
Note that Seed has no way of knowing to which persistence unit belong each entity class, so you must indicate this with
the following configuration:

```ini
[org.myorganization.myapp.domain.*]
jpa-unit = my-jpa-unit
```
    
This will put all the entities scanned in the `org.myorganization.myapp.domain` package and its subpackages into the
`my-jpa-unit` persistence unit.

### Configuration options

You can specify the type of transactions by using the following configuration
([more info](http://docs.oracle.com/javaee/6/api/javax/persistence/spi/PersistenceUnitInfo.html#getTransactionType()):

```ini
[org.seedstack.seed.persistence.jpa.unit.my-jpa-unit]
transaction-type = JTA | RESOURCE_LOCAL
```
    
If you prefer to use XML JPA mapping files instead of annotations you can specify them with the following configuration
([more info](http://docs.oracle.com/javaee/6/api/javax/persistence/spi/PersistenceUnitInfo.html#getMappingFileNames()):

```ini
[org.seedstack.seed.persistence.jpa.unit.my-jpa-unit]
mapping-files = path/to/mapping/file1.xml, path/to/mapping/file2.xml, ...
```
    
You can specify the validation mode with the following configuration
([more info](http://docs.oracle.com/javaee/6/api/javax/persistence/spi/PersistenceUnitInfo.html#getValidationMode()):

```ini
[org.seedstack.seed.persistence.jpa.unit.my-jpa-unit]
validation-mode = path/to/mapping/file1.xml, path/to/mapping/file2.xml, ...
```

You can specify the shared cache mode with the following configuration
([more info](http://docs.oracle.com/javaee/6/api/javax/persistence/spi/PersistenceUnitInfo.html#getSharedCacheMode())):

```ini
[org.seedstack.seed.persistence.jpa.unit.my-jpa-unit]
shared-cache-mode = ALL | NONE | ENABLE_SELECTIVE | DISABLE_SELECTIVE | UNSPECIFIED
```

## With persistence.xml

In this mode you must provide a `persistence.xml` file. This file has to be placed under the `META-INF` directory of your
classpath (for instance in `src/main/resources/META-INF`).

    <persistence xmlns="http://java.sun.com/xml/ns/persistence"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd"
        version="2.0">

        <persistence-unit name="my-jpa-unit" transaction-type="RESOURCE_LOCAL">
            <class>org.seedstack.seed.persistence.jpa.sample.Item1</class>
        </persistence-unit>
    </persistence>


In this example you can find:

* The JPA version (2.0 in this example)
* A unit named `my-jpa-unit` 
* A local transaction type (`RESOURCE_LOCAL`) 
* The list of persistence classes to map

You can declare as many units as required in a `persistence.xml` file. You can also add configuration properties directly 
in this file, although it is recommended to specify them in the configuration. When using a `persistence.xml` file, you 
must either specify a datasource via properties or via JNDI.

### Datasource via properties 

The datasource can be specified through properties, either in the configuration:

```ini
[org.seedstack.seed.persistence.jpa.unit.my-jpa-unit]
property.javax.persistence.jdbc.driver = ...
property.javax.persistence.jdbc.url = ...
property.javax.persistence.jdbc.user = ...
property.javax.persistence.jdbc.password = ...
```
    
Or in the directly in the `persistence.xml` file:
        
    <persistence-unit name="my-jpa-unit" transaction-type="RESOURCE_LOCAL">
        ...
        
        <properties>
            <property name="..." value="..."/>
        </properties>
        
        ...
    </persistence-unit>

The specification of properties in the configuration is recommended as it allows greater flexibility (access to
environment variables and system properties, usage of configuration profiles, macros, ...). 

### Datasource via JNDI

In some environments like in a Web server, it is recommended to use JNDI instead of configuration properties. You can
do so by specifying the JNDI name of the datasource in the `persistence.xml` file:
 
    <non-jta-data-source>java:comp/env/jdbc/my-datasource</non-jta-data-source>

In case of a JTA data source, use following line instead:

    <jta-data-source>java:comp/env/jdbc/my-datasource</jta-data-source>

In case of a Web application, add the following JNDI reference in your `web.xml` file:

    <resource-ref>
        <res-ref-name>jdbc/my-datasource</res-ref-name>
        <res-type>javax.sql.DataSource</res-type>
        <res-auth>Container</res-auth>
    </resource-ref>

You may need to add additional files depending on your Web container. Please refer to the the dedicated container 
documentation.

# Using the Entity Manager

To use the Entity Manager in your code, simply inject it:

    public class MyRepository {

        @Inject
        private EntityManager entityManager;

        ...
    }

All JPA interactions have to be realized inside a transaction. Refer to the [transaction support 
documentation](../../transactions) for more detail. Below is an example using the annotation-based transaction 
demarcation (notice the `persistence.xml` unit name in `@JpaUnit` annotation)

    public class MyService {

        @Inject
        private MyRepository myRepository;

        @Transactional
        @JpaUnit("my-jpa-unit")
        public void doSomethingWithMyJpaUnit() {

        }
    }

{{% callout info %}}
Note that the `@JpaUnit` annotation is NOT optional as the JPA support includes the JDBC support as a dependency, so the
condition that you must have only one transactional support in your application cannot be fulfilled. You can omit the 
name of the unit if you only have one unit in your application, although we recommend you to always specify it explicitly. 
{{% /callout %}}


