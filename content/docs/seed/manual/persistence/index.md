---
title: "Persistence overview"
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

SEED provides various persistence supports. Multiple supports can be used simultaneously 
by importing the corresponding Maven dependencies into your application module.

# JDBC

Seed JDBC persistence support allows you to inject and use configured JDBC connections in a transactional manner.
Add it to your application with the following Maven dependency:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-persistence-jpa-support</artifactId>
    </dependency>

# JPA

Seed JPA persistence support allows you to inject and use configured JPA units in a transactional manner. 
Add it to your application with the following Maven dependency:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-persistence-jpa-support</artifactId>
    </dependency>

# Elastic Search

Seed ElasticSearch persistence support allows you to inject ElasticSearch clients. 
Add it to your application with the following Maven dependency:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-persistence-elasticsearch-support</artifactId>
    </dependency>

# In memory

SEED in-memory persistence support allows to store data in memory buckets, mainly for testing purposes. 
Add it to your application with the following Maven dependency:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-persistence-inmemory-support</artifactId>
    </dependency>


