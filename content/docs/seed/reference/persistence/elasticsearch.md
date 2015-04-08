---
title: "ElasticSearch"
type: "reference"
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
        weight: 40
---


The support integrates **[ElasticSearch Java API](http://www.elasticsearch.org/guide/en/elasticsearch/client/java-api/current/index.html)** 
which allows to interact with an **ElasticSearch server**. To understand how **ElasticSearch** works and if it suits 
your requirements, please check the [website](http://www.elasticsearch.org).

# Usage

In order to communicate with an  **ElasticSearch server**, just define the appropriate configuration and inject the 
`@Named` client (`org.elasticsearch.client.Client` interface) accordingly . 

Two kinds of client implementations are available: "node client" (in-memory/local node) and "transport client" 
(distant server).

# Configuration

Declare your list of clients (props file) in order to have them managed by SEED:

    org.seedstack.seed.persistence.elasticsearch.clients = myClient1, ...

Add properties to your ElasticSearch client by specifying a section as follows:

    [org.seedstack.seed.persistence.elasticsearch.client.myClient1]
    property.hosts =  myHost1:myPort1, myHost2:myPort2, ...
    property.cluster.name = myCluster
    property.client.transport.ignore_cluster_name =
    property.client.transport.sniff =
    property.client.transport.nodes_sampler_interval =
    property.client.transport.ping_timeout =

If you omit the `hosts` property, the client will be automatically associated with a local node.

# Example

Configuration example for an embedded ElasticSearch node (previously referred to as "node client"):

    org.seedstack.seed.persistence.elasticsearch.clients = client1
    
    [org.seedstack.seed.persistence.elasticsearch.client.client1]
    property.cluster.name = test-cluster-1

To inject this configured **ElasticSearch client**, just inject it using the `@Named` annotation.

	@Inject 
	@Named("myClient1")
	Client myClient1;

	
