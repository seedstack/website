---
title: "Configuration"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedJMS"
menu:
    SeedJMS:
        weight: 20
---

Configuring your messaging solution is mandatory in order to be able to use SEED JMS support.

# Connection factories
The connectionFactory is the base to create connections. Connection factories are declared using the following property:

    com.inetpsa.seed.jms.connection-factories = connection-factory-1, connection-factory-1, ...

Configuring each connection factory just requires its name in subsequent properties:

    com.inetpsa.seed.jms.connection-factory.connection-factory-1... = ...

## Direct instantiation configuration

In direct instantiation mode, SEED will create the connection factory and configure it. Use the following property
syntax to define the configuration:

    [com.inetpsa.seed.jms]
    connection-factory.connection-factory-1.vendor.class = fully qualified vendor classname
    connection-factory.connection-factory-1.vendor.property.property1 = value1
    connection-factory.connection-factory-1.vendor.property.property2 = value2
    connection-factory.connection-factory-1.vendor.property.property3 = value3
    ...

SEED will instantiate the specified class and will set each property as above defined.

## With JNDI

In JNDI mode, SEED will lookup for connection factory instances using the name and optionally the specified context:

    [com.inetpsa.seed.jms]
    connection-factory.connection-factory-1.jndi.name = name to lookup for
    connection-factory.connection-factory-1.jndi.context = context for lookup

The context must be specified according to the list of JNDI contexts defined in core support (see the corresponding
documentation for more details). If no context is specified the default context is used.

# Connections

A `Connection` encapsulates a virtual connection with a JMS provider. Multiple connections can be created and managed by SEED.
All connections must be listed with associated connection factories used to create each of them:

    [com.inetpsa.seed.jms]
    connections = connection-1, connection-2, ...
    connection.connection-1.connection-factory = connection-factory-1

A connection credentials can be specified using the following properties:

    [com.inetpsa.seed.jms]
    connection.connection-1.user = ...
    connection.connection-1.password = ...


SEED can also set a connection client id (not set by default). If requested, SEED will set the client id with by appending **applicationID an connection name**. 
Set property as follows:

    com.inetpsa.seed.jms.connection.connection-1.set-client-id = true | false

# Additional properties

Configure the delay in milliseconds between two reconnection attempts.

    [com.inetpsa.seed.jms]
    reconnection-delay = 30000

Disable the reconnection feature.

    [com.inetpsa.seed.jms]
    managed-connection = false

# WebSphere MQ Sample

## Add vendor dependencies

Add required dependencies for your messaging solution:

    <dependency>
        <groupId>com.ibm.mq</groupId>
        <artifactId>mq</artifactId>
        <version>${mq.version}</version>
    </dependency>
    <dependency>
        <groupId>com.ibm.mq</groupId>
        <artifactId>mqjms</artifactId>
        <version>${mq.version}</version>
    </dependency>
    <dependency>
        <groupId>com.ibm.mq</groupId>
        <artifactId>jmqi</artifactId>
        <version>${mq.version}</version>
    </dependency>
    <dependency>
        <groupId>com.ibm.mq</groupId>
        <artifactId>dhbcore</artifactId>
        <version>${mq.version}</version>
    </dependency>

## Add configuration

    [com.inetpsa.seed.jms]
    connection-factories = mq

    #Set MQConnectionFactory  properties
    connection-factory.mq.vendor.class = com.ibm.mq.jms.MQConnectionFactory
    connection-factory.mq.vendor.property.queueManager = ABCDE1234
    connection-factory.mq.vendor.property.hostName = abcde1234.inetpsa.com
    connection-factory.mq.vendor.property.channel =  ABCDE1234.ABCD.ABC
    connection-factory.mq.vendor.property.port = 1234
    connection-factory.mq.vendor.property.transportType = 1

    #configure connections
    connections = mq
    connection.mq.connection-factory = mq
