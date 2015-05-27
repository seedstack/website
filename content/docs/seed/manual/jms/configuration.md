---
title: "Configuration"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedJMS"
tags:
    - "jms"
    - "configuration"
menu:
    SeedJMS:
        weight: 20
---

Configuring your messaging solution is mandatory in order to be able to use Seed JMS support.

# Connection factories
The connectionFactory is the base to create connections. Connection factories are declared using the following property:

    [org.seedstack.seed.jms]
    connection-factories = connection-factory-1, connection-factory-1, ...

## Direct instantiation configuration

In direct instantiation mode, Seed will create the connection factory and configure it by setting properties on its
instance. Use the following property syntax to define the configuration:

    [org.seedstack.seed.jms]
    connection-factory.connection-factory-1.vendor.class = fully qualified vendor classname
    connection-factory.connection-factory-1.vendor.property.property1 = value1
    connection-factory.connection-factory-1.vendor.property.property2 = value2
    connection-factory.connection-factory-1.vendor.property.property3 = value3
    ...

Seed will instantiate the specified class and will set each property as defined above.

## With JNDI

In JNDI mode, Seed will lookup for connection factory instances using the name and optionally the specified context:

    [org.seedstack.seed.jms]
    connection-factory.connection-factory-1.jndi.name = name to lookup for
    connection-factory.connection-factory-1.jndi.context = context for lookup  # Optional

The context must be specified according to the list of JNDI contexts defined in core support (see [the corresponding
documentation](../../core/jndi)). If no context is specified the default context is used.

# Connections

Multiple connections can be created and managed by Seed. All connections must be listed in the following property:

    [org.seedstack.seed.jms]
    connections = connection-1, connection-2, ...

Each connection can then be configured as follows:

    [org.seedstack.seed.jms.connection.connection-1]
    connection-factory = connection-factory-1
    user = ...         # Optional
    password = ...     # Optional

## Exception listener

You can specify an exception listener on a connection with the following property:
 
    [org.seedstack.seed.jms.connection.connection-1]
    exception-listener = fully.qualified.class.of.the.exception.listener

## Automatic reconnection

Seed-managed JMS connections can automatically reconnect after they go down. This behavior is enabled by default but
can be disabled by the following property:

    [org.seedstack.seed.jms.connection.connection-1]
    managed-connection = false
    
The delay before automatic reconnection is 30 seconds but it can be changed with the following property:
    
    [org.seedstack.seed.jms.connection.connection-1]
    reconnection-delay = 10000
    
Note that the delay is specified in milliseconds.     
    
## Client ID

Seed will automatically set the client ID of the connection if not in JEE mode (see below). To disable the setting of
the client ID, use the following property:

    [org.seedstack.seed.jms.connection.connection-1]
    set-client-id = false

The client ID itself can be defined with the following property:

    [org.seedstack.seed.jms.connection.connection-1]
    client-id = my-client-id

If not specified, the default client ID is formed by concatenating the application identifier with the connection name.

## JEE mode

In a strict JEE environment, some JMS methods are forbidden (refer to the EE.6.7 section of the JavaEE platform specification).
You can enable the JEE mode on a connection with the following property:

    [org.seedstack.seed.jms.connection.connection-1]
    jee-mode = true
    
In this mode, the forbidden methods are not invoked. It prevents the uses of asynchronous message reception (driven by
the JMS provider after setMessageListener()) so polling must be used instead. 

Seed allows to still use a MessageListener when in polling mode but a message poller must be specified when registering 
the listener. Having a MessageListener defined without a corresponding message poller while in JEE mode results in an 
error.

