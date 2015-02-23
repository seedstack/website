---
title: "Receiving"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedJMS"
menu:
    SeedJMS:
        weight: 40
---

To receive JMS messages, create a listener class which implements the `javax.jms.MessageListener` interface and carries `@JMSMessageListner` annotation with the following parameters:

* The `connection` parameter specifying the connection that will be used to receive the messages,
* The `destinationType` parameter specifying what kind of destination the class will listen to (queue or topic),
* The `destinationName` parameter specifying the name of the destination.

```
@JmsMessageListener(connection = "connection1", destinationType = DestinationType.QUEUE, destinationName = "queue1")
public class MyMessageListener implements MessageListener {

    @Override
    @Transactional
    public void onMessage(Message message) {
        ...
    }

}
```

<div class="callout callout-info">
If the JMS connection go down, the MessageListener will benefit from the SEED JMS reconnection mechanism.
</div>
