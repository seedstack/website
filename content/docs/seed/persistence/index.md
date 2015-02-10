SEED provides various persistence supports. Multiple supports can be used simultaneously 
by importing the corresponding Maven dependencies into your application module.

# JPA

SEED JPA persistence support addresses the persistence of relational data in SEED applications. It is available through 
following Maven dependency:

    <dependency>
        <groupId>com.inetpsa.fnd.seed</groupId>
        <artifactId>seed-persistence-jpa-support</artifactId>
    </dependency>

# Elastic Search

SEED Elastic Search persistence support enables configuration and management of ElasticSearch clients in SEED applications. 
It is available through following Maven dependency:

    <dependency>
        <groupId>com.inetpsa.fnd.seed</groupId>
        <artifactId>seed-persistence-elasticsearch-support</artifactId>
    </dependency>

# In memory

SEED in-memory persistence support provides a very simple way to "persist" data in memory buckets. It is mainly for
testing purposes. It is available through following Maven dependency:

    <dependency>
        <groupId>com.inetpsa.fnd.seed</groupId>
        <artifactId>seed-persistence-inmemory-support</artifactId>
    </dependency>

# TinkerPop

Address the persistence of graph oriented data in SEED applications. It is available through following Maven dependency:

    <dependency>
        <groupId>com.inetpsa.fnd.seed</groupId>
        <artifactId>seed-persistence-tinkerpop-support</artifactId>
    </dependency>

