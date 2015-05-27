---
title: "Receiving"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedJMS"
tags:
    - "jms"
    - "receiving"
    - "message"
    - "listener"
    - "transactions"
menu:
    SeedJMS:
        weight: 40
---

To receive JMS messages, create a listener class which implements the `javax.jms.MessageListener` interface and is 
annotated with `@JMSMessageListner`. This annotation takes the following parameters:

* The `connection` parameter specifying the connection that will be used to receive the messages.
* The `destinationType` parameter specifying what kind of destination the class will listen to (queue or topic).
* The `destinationName` parameter specifying the name of the destination.
* The `poller` parameter is optional and is used to enable polling on this listener.

# Polling

When a `poller` parameter is specified, no asynchronous message reception (driven by the JMS provider after a 
setMessageListener() call) takes place. Polling behavior is delegated to the specified class (which must implement
`org.seedstack.seed.jms.spi.MessagePoller`).

## Simple message poller

If polling is needed on a particular listener you may use the `org.seedstack.seed.jms.SimpleMessagePoller` class for 
basic polling needs. It spawns a thread which calls to `receive()` in a loop, dispatching the message to the 
`onMessage()` method when a message is received. If an exception occurs during `receive()`, the exception is dispatched
to the connection exception listener if any.

If an exception is thrown during the reception or message handling, the polling thread is shutdown and scheduled to
restart 10 seconds later. When used in conjunction with the automatic reconnection, the exception also triggers a
connection refresh. In that case, the poller may retry to receive messages several times before the connection is up again, 
depending on the configured connection refresh timeout.