---
title: "Consuming"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedWebServices"
tags:
    - "web-service"
    - "wsdl"
    - "maven"
    - "wsimport"
menu:
    SeedWebServices:
        weight: 50
---

The goal of this page is to detail the consumption of an Hello World SOAP based Web Service. Configure the `jaxws-maven-plugin`
and use `wsimport` to generate web service client java from `wsdl`.

You can then use the `wsimport` generated class in your application code:

```
HelloService helloService = new HelloService();
Hello helloServicePort = helloService.getHelloServicePort();
((BindingProvider) helloServicePort).getRequestContext().put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY, "http://localhost:" + wsPort + "/ws/hello");
helloServicePort.sayHello("World");
```

