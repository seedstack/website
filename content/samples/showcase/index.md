---
title: "Showcase"
type: "home"
zones:
    - "Samples"
sections:
    - "Showcase"
tags:
    - Application
    - Sample
menu:
    Showcase:
        weight: 10
---

The SeedStack Showcase is a sample application that showcases various aspect of the stack. It is built around the 
[E-commerce domain sample](../domain) and mainly demonstrates:

* How to expose a domain through a REST API with Domain <-> Representation mapping, pagination and more.
* How to expose a domain through a Web Service,
* How to write and use an application service on top of the domain,
* How to develop a W20 frontend for the REST API,
* How to configure persistence and security. 

# Running it!

To run the showcase, you just need to run `mvn install` from the root project and then run `mvn jetty:run` from the
`web` module. In any case, the web sub module is a simple WAR, so you may run it from whatever Web server you want.

{{% callout info %}}
The Showcase can be found on this [GitHub repository](https://github.com/seedstack/showcase). You can deploy the master
to Heroku directly from the README file if you don't want to run it locally. 
{{% /callout %}}
