---
title: "WebSockets"
type: "home"
zones:
    - "Docs"
tags:
    - web
    - interfaces
menu:
    docs:
        weight: 6
        parent: "web"
---

Seed also integrates the Java API for WebSocket (JSR 356), allowing server and client endpoints to be injected. WebSocket
support requires Java 7 and a compatible server to work.

## Server endpoints

No specific configuration is required for server endpoint. Just declare a standard JSR 356 endpoint:

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
        public void message(String message, 
                            Session client) throws IOException, EncodeException {
            for (Session peer : client.getOpenSessions()) {
                peer.getBasicRemote().sendText(echoService.echo(message));
            }
        }
    
        @OnClose
        public void onClose(Session session, CloseReason closeReason) {
            logger.info(String.format("Session %s close because of %s", 
                session.getId(), closeReason));
        }
    
        @OnError
        public void onError(Session session, Throwable t) {
            logger.error(t.getMessage, t);
        }
        
    }

In this example, the endpoint receives a message and then broadcast it to all clients.

## Client endpoints

Unlike server endpoints, client endpoints have to explicitly specify a `SeedClientEndpointConfigurator` in order to be 
managed by Seed.

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

