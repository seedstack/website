---
title: "Samples"
type: "home"
zones:
    - "GettingStarted"
sections:
    - "GettingStartedSamples"
menu:
    GettingStartedSamples:
        weight: 10
---

We provide several samples demonstrating various aspects of SeedStack. 

# Download

You can clone the `samples` git repository by running:
 
```sh
git clone https://github.com/seedstack/samples.git
```

Go into the cloned repository and initialize all submodules to the tip of their master branch and checkout it with the following commands:

```sh
cd samples
git submodule update --remote --recursive --init && git submodule foreach --recursive git checkout master
```

{{% callout tips %}}
Each sample contains a `README.md` file describing how to build and launch it. 
{{% /callout %}} 

# List


| Sample | Demonstrated features |
|---|---|
| [Batch job](https://github.com/seedstack/samples/tree/master/batch) | Spring Batch "Hello World" job |
| [Business code](https://github.com/seedstack/samples/tree/master/business) | Business framework usage |
| [Catalog micro-service](https://github.com/seedstack/catalog-microservice-sample/tree/master) | JAX-RS integration, hypermedia and JSON-home |
| [Command-line](https://github.com/seedstack/samples/tree/master/cli) | CLI commands, options and arguments |
| [Java framework basics](https://github.com/seedstack/samples/tree/master/seed) | Security, configuration, diagnostic, Guice, custom plugin, CLI, REST, Web, Websocket, integration testing |
| [Spring bridge](https://github.com/seedstack/samples/tree/master/spring-bridge) | Spring bridge (two-way injection, configuration) |
| [Store Web application](https://github.com/seedstack/store-webapp-sample/tree/master) | REST resources, JPA persistence, JavaMail, pagination, static resources serving, simple business code |
| [Web Services](https://github.com/seedstack/web-services-sample/tree/master) | JAX-WS integration through Web-Services add-on |
