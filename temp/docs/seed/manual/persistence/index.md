---
title: "Overview"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedPersistence"
tags:
    - "persistence"
    - "maven"
menu:
    SeedPersistence:
        weight: 10
---

Seed provides various persistence supports. Multiple supports can be used simultaneously by adding all the corresponding 
Maven dependencies.

# JDBC

Allows you to configure, inject and use [JDBC](https://jcp.org/en/jsr/detail?id=221) connections. Add it to your application 
with the following Maven dependency:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-persistence-support-jdbc</artifactId>
    </dependency>
    
Main features:
  
* Transactions
* Connection pooling with either [HikariCP](http://brettwooldridge.github.io/HikariCP/), [Commons DBCP](http://commons.apache.org/proper/commons-dbcp/),
[C3P0](http://www.mchange.com/projects/c3p0/) or a custom provider.
* JNDI

Learn about JDBC support [here](jdbc).

# JPA

Allows you to configure, inject and use [JPA](https://jcp.org/en/jsr/detail?id=338) units. Add it to your application 
with the following Maven dependency:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-persistence-support-jpa</artifactId>
    </dependency>
    
Main features:
    
* Supports JPA 1.0, 2.0 and 2.1
* Transactions
* Automatic or `persistence.xml`-based configuration
* Ability to use a JDBC support datasource
* JNDI
           
Learn about JPA support [here](jpa).

# ElasticSearch

Allows you to configure, inject and use [ElasticSearch](https://www.elastic.co) clients. Add it to your application with 
the following Maven dependency:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-persistence-support-elasticsearch</artifactId>
    </dependency>

Main features:

* Embedded indexes
* Remote indexes

Learn about ElasticSearch support [here](elasticsearch).
