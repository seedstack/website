---
title: "Sending"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedJMS"
tags:
    - "jms"
    - "sending"
    - "message"
    - "transactions"
menu:
    SeedJMS:
        weight: 30
---

# SEED Managed Session

Using a managed session consists in the following steps:

1. Inject a Session (note that a session is *transactional*).
2. Specify the connection to use with the `@JmsConnection` annotation.
3. Use the session to create the destination Queue or Topic.
4. Transaction will be automatically committed or rolled back according to your `@Transactional` annotation.
5. Session object is managed by SEED. There is no need to care about thread-safe usage or closing it.
6. To fine tune the Transaction, please refer to the transaction support documentation.

Below is an example using a session to create a queue and send a TextMessage:

    public class ClassWithJMSSending {
        @Inject
        private Session session;

        @Transactional
        @JmsConnection("connection-1")
        public void send(String stringMessage) throws JMSException {
            Destination queue = session.createQueue("queue1");
            TextMessage message1 = session.createTextMessage();
            message1.setText(stringMessage);

            MessageProducer producer = session.createProducer(queue);
            producer.send(message1);
        }
    }

# Manually Created Session

A connection can be injected directly inject and used to manually create all needed objects to send a message.
In this case, except for the connection, nothing is managed by SEED. **Objects life cycles have to be dealt with (creation, closing, etc.).**

    public class MyUnManagedMessageSender {
        @Inject
        @Named("connection-1")
        private Connection connection;

        public void send(String stringMessage) throws JMSException {
            Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            Destination queue = session.createQueue("queue2");
            TextMessage message = session.createTextMessage();
            message.setText(stringMessage);
            message.setJMSExpiration(1000);
            message.setJMSReplyTo(queue);
            MessageProducer producer = session.createProducer(queue);
            producer.send(message);
            session.close();
        }
    }

# Automatic reconnection

When you inject a session or a connection, Seed provides managed objects which embed a reconnection mechanism.
When the connection is down, creating a producer or sending a message will throw a JMSException. But when the connection will
be back **the connection and the session will be refreshed**. So you won't need to get new connection or session.
By default Seed attempt to reconnect every 30 seconds, but this is configurable (see
[here](../configuration#additional-properties)).

> Notice that it is still up to you to handle the retry policy on the sent message.