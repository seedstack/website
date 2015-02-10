Java Message Service (JMS) is a Java API that allows applications to create, send, receive, and read messages.
This support provides a JMS 1.1 integration (a.k.a. JSR 914). It automatically manages connection factories,
connections, sessions and message consumers/listeners while retaining the standard JMS API. Moreover connection
and session try to reconnect automatically after a JMS connection failure.

<div class="callout callout-info">
Implementations are not provided by this support and must be configured depending on your messaging solution.
</div>

To enable JMS support in your application, use the following dependency snippet:

    <dependency>
        <groupId>com.inetpsa.fnd.seed</groupId>
        <artifactId>seed-jms-support-core</artifactId>
    </dependency>

JMS specification jar dependency is required as well since SEED JMS support doesn't transitively provide this dependency:

    <dependency>
        <groupId>javax.jms</groupId>
        <artifactId>jms</artifactId>
        <version>1.1</version>
        <scope>provided</scope>
    </dependency>
