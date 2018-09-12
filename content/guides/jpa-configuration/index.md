---
title: "JPA configuration, step-by-step"
author: "Adrien LAUER"
date: 2018-09-11
tags:
    - persistence
zones:
    - Guides
noMenu: true
---

This guide details step-by-step how to configure JPA in SeedStack, to access an existing relational database.<!--more-->

## Add the dependencies

### JPA add-on

First, add the SeedStack JPA add-on:

{{< dependency g="org.seedstack.addons.jpa" a="jpa" >}}

### JPA provider

Beyond the JPA add-pn, an actual JPA implementation, called a JPA provider, is required: 

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

## Configure the datasource

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

## Configure the JPA unit

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
```
{{% /tab %}}
{{% /tabs %}} 

## Affect persisted classes to unit

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

## Write your first JPA entity

...
