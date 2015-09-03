---
title: "ElasticSearch"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedPersistence"
tags:
    - "elasticsearch"
    - "configuration"
    - "example"
menu:
    SeedPersistence:
        weight: 90
---


Seed ElasticSearch support integrates the [ElasticSearch Java API](https://www.elastic.co/guide/en/elasticsearch/client/java-api/current/index.html) 
which allows to interact with an ElasticSearch server or an embedded ElasticSearch instance. 

To add the ElasticSearch persistence support to your project, use the following Maven dependency:

     <dependency>
         <groupId>org.seedstack.seed</groupId>
         <artifactId>seed-persistence-support-elasticsearch</artifactId>
     </dependency>

# Configuration

To access an ElasticSearch index, you need to declare a client in configuration. Multiple clients can be configured. They
must be listed in the following property:

```ini
org.seedstack.seed.persistence.elasticsearch.clients = client1, client2, ...
```
    
## Remote instance
    
To access a remote ElasticSearch index, you need to specify the host(s) of one or more node(s) of the ElasticSearch 
cluster:
     
```ini
[org.seedstack.seed.persistence.elasticsearch.client.client1]
hosts =  host1:port1, host2:port2, ...
```

You can omit the port in which case will be set to the ElasticSearch default (9300).      
    
## Embedded instance
    
If you don't specify the `hosts` property, a local ElasticSearch node will be created and stored in the `persistence-elasticsearch/{client-name}` 
subdirectory of the Seed local storage location, where `{client-name}` is the name of the ElasticSearch client.
         
## Other options
         
You can specify any configuration property of the ElasticSearch client with the following syntax:
          
```ini
[org.seedstack.seed.persistence.elasticsearch.client.client1]
property.name.of.elasticsearch.property = value
```

# Usage

To use a configured ElasticSearch client, simply inject it where needed:

```java
@Inject 
@Named("client1")
Client client1;
```

# Example

Configuration for an embedded ElasticSearch instance:

```ini
    org.seedstack.seed.persistence.elasticsearch.clients = test
    
    [org.seedstack.seed.persistence.elasticsearch.client.test]
    property.cluster.name = test-cluster-1
```

To inject this configured client, use the following syntax:

```ini
	@Inject 
	@Named("test")
	Client testClient;
```
