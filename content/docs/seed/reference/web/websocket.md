---
title: "WebSockets"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedWeb"
tags:
    - "web"
    - "websocket"
    - "maven"
    - "test"
menu:
    SeedWeb:
        weight: 60
---

SEED Web support integrates the the Java API for WebSocket (a.k.a. JSR 356) in a specific module.

<div class="callout callout-info">
The JSR 356 is part of JEE 7, so <strong>it will only works for a JDK 7</strong> or earlier.
</div>

Add the following dependency to your pom to add the support.

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-web-support-websocket</artifactId>
    </dependency>

Here is more information on the JSR:

* [http://www.oracle.com/technetwork/articles/java/jsr356-1937161.html](http://www.oracle.com/technetwork/articles/java/jsr356-1937161.html)
* [https://tyrus.java.net/documentation/1.8.3/user-guide.html](https://tyrus.java.net/documentation/1.8.3/user-guide.html)

# Server endpoint

The server endpoints from the JSR work as is with SEED. This support just adds the ability to inject managed objects. The above
code snippet describes how to declare a server endpoint.

```java
/**
 * This WebSocket endpoint get messages and retrieve them.
 */
@ServerEndpoint(value = "/chat")
public class ChatEndpoint {

    @Logging
    private Logger logger;

    @Inject
    EchoService echoService;

    @OnOpen
    public void onOpen(Session session) {
        logger.info("Connected ... " + session.getId());
    }

    @OnMessage
    public void message(String message, Session client) throws IOException, EncodeException {
        for (Session peer : client.getOpenSessions()) {
            peer.getBasicRemote().sendText(echoService.echo(message));
        }
    }

    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        logger.info(String.format("Session %s close because of %s", session.getId(), closeReason));
    }

    @OnError
    public void onError(Session session, Throwable t) {
        logger.error(t.getMessage, t);
    }
}
```

This endpoint receives a message and then broadcast it to all the clients.

# Client endpoint

Unlike server endpoints, the client endpoints have to declare explicitly a `SeedClientEndpointConfigurator` to be managed
by SEED.

```java
@ClientEndpoint(configurator = SeedClientEndpointConfigurator.class)
public class ChatClientEndpoint1 {
    public static final String TEXT = "Client1 joins";
    public static CountDownLatch latch;
    public static String response;

    @OnOpen
    public void onOpen(Session session) {
        try {
            session.getBasicRemote().sendText(TEXT);
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }

    @OnMessage
    public void processMessage(String message) {
        response = message;
        latch.countDown();
    }
}
```

# Test your endpoints

If you run your test with a JDK 7 or earlier, will be able to test your endpoints using Arquillian. Here is an example
which test two client endpoints.

```
public class WebSocketIT extends AbstractSeedWebIT {

    @Logging
    private Logger logger;

    @Inject
    ChatClientEndpoint1 chatClientEndpoint1;

    @Inject
    ChatClientEndpoint2 chatClientEndpoint2;

    @Deployment
    public static WebArchive createDeployment() {
        return ShrinkWrap.create(WebArchive.class).setWebXML("WEB-INF/web.xml");
    }

    @Test
    @RunAsClient
    public void communication_is_working(@ArquillianResource URL baseUrl) throws Exception {
        ChatClientEndpoint1.latch = new CountDownLatch(1);

        final Session session1 = connectToServer(baseUrl, chatClientEndpoint1);
        assertNotNull(session1);

        assertTrue(ChatClientEndpoint1.latch.await(2, TimeUnit.SECONDS));
        assertEquals("echo: " + ChatClientEndpoint1.TEXT, ChatClientEndpoint1.response);

        ChatClientEndpoint1.latch = new CountDownLatch(1);
        ChatClientEndpoint2.latch = new CountDownLatch(1);

        final Session session2 = connectToServer(baseUrl, chatClientEndpoint2);
        assertNotNull(session2);

        assertTrue(ChatClientEndpoint1.latch.await(2, TimeUnit.SECONDS));
        assertTrue(ChatClientEndpoint2.latch.await(2, TimeUnit.SECONDS));
        assertEquals("echo: " + ChatClientEndpoint2.TEXT, ChatClientEndpoint1.response);
        assertEquals("echo: " + ChatClientEndpoint2.TEXT, ChatClientEndpoint2.response);
    }

    private Session connectToServer(URL baseUrl, Object endpoint) {
        try {
        WebSocketContainer container = ContainerProvider.getWebSocketContainer();
        URI uri = new URI("ws://" + baseUrl.getHost() + ":" + baseUrl.getPort()
            + baseUrl.getPath() + "chat");
        return container.connectToServer(endpoint, uri);
        } catch(Exception e) {
            logger.error(e.getMessage(), e);
            fail();
        }
    }
}
```