---
title: "Transports"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedWebServices"
tags:
    - "web-service"
    - "http"
    - "jms"
    - "jndi"
menu:
    SeedWebServices:
        weight: 30
---

SEED WS supports HTTP and JMS transports. Each URL syntax described below.

# Standalone HTTP

In a standalone environment you need to specify the full URL with the binding address and the port:

    http://localhost:4578/ws/hello
    
# Web server HTTP

In a Web server environment you only need to specify the URL pattern:

    /ws/hello

# JMS

JMS URIs are unchanged whatever the environment. They conform to the [SOAP JMS specification](http://www.w3.org/TR/soapjms/). 
There are three lookup variants to retrieve connection factories and destinations:

## JNDI lookup

This variant allows to retrieve the connection factory and the destination from JNDI:

    jms:jndi:DESTINATION.NAME?jndiInitialContextFactory=fully.qualified.classname.of.jndi.initial.context.factory&jndiURL=url://to/jndi/context&jndiConnectionFactoryName=lookupNameForConnectionFactory&replyToName=REPLY.DESTINATION.NAME
 
The `replyToName` parameter can be omitted in which case the implementation will create a temporary queue for the response. 
 
## Queue lookup

This variant allows to directly specify a queue name using a connection factory from the one(s) configured via the SEED JMS plugin:

    jms:queue:QUEUE.NAME?connectionFactoryName=nameOfConfiguredConnectionFactory&replyToName=REPLY.QUEUE.NAME

The `replyToName` can be omitted in which case the implementation will create a temporary queue for the response. 

## Topic lookup

This variant allows to directly specify a queue name using a connection factory from the one(s) configured via the SEED JMS plugin:

    jms:topic:TOPIC.NAME?connectionFactoryName=nameOfConfiguredConnectionFactory

The `topicReplyToName` can be omitted in which case the implementation will create a temporary queue for the response (not a temporary topic). 
