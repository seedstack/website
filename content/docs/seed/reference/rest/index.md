---
title: "Overview"
zones:
    - "Seed"
sections:
    - "SeedRest"
menu:
    SeedRest:
        weight: 10
---

SEED REST support provides a JAX-RS integration. The chosen implementation is [Jersey](https://jersey.java.net/).
This documentation does not deal with REST concepts. Please check the REST training module if you need more details on
how to design RESTful resources. In order to enable REST support in your application web module, use the following dependency:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-rest-support-core</artifactId>
    </dependency>

**All rest resources are mapped by default to `**/rest/\***`. All resources and providers are automatically detected.**
Details about (Jersey) implementation are available on [this page](https://jersey.java.net/documentation/1.17/index.html).

