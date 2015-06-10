---
title: "JMS overview"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedJMS"
tags:
    - "jms"
    - "maven"
menu:
    SeedJMS:
        weight: 10
---


Java Message Service (JMS) is a Java API that allows applications to create, send, receive, and read messages.
This support provides a JMS 1.1 integration (a.k.a. JSR 914). It automatically manages connection factories,
connections, sessions and message consumers/listeners while retaining the standard JMS API. Moreover connection
and session try to reconnect automatically after a JMS connection failure.

{{% callout info %}}
JMS provider implementation is not provided by this support and must be configured depending on your messaging solution.
{{% /callout %}}

To enable JMS support in your application, use the following dependency snippet:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-jms-support-core</artifactId>
    </dependency>

The JMS specification jar dependency is required as well since Seed JMS support doesn't transitively provide this 
dependency:

    <dependency>
        <groupId>javax.jms</groupId>
        <artifactId>jms</artifactId>
        <version>1.1</version>
        <scope>provided</scope>
    </dependency>
