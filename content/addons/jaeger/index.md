---
title: "Jaeger-addon"
addon: "Jaeger"
repo: "https://github.com/seedstack/jaeger-addon"
author: Amit Kumar  
description: "Integrates Jaeger Tracing with SeedStack."
tags:
    - Tracing
zones:
    - Addons
noMenu: true    
---

The Jaeger-addon allows you to configure, inject and use [Jaeger Tracing](https://www.jaegertracing.io/docs/1.25/getting-started/).<!--more-->

## Dependency

{{< dependency g="org.seedstack.addons.jaeger" a="jaeger" >}}

## Configuration

To access Jaeger Tracing, you need to declare a Jaeger configuration. if (agentHost,agentPort) and endPoint both are defined then it will make (agentHost,agentPort) ineffective. if (agentHost,agentPort) and endPoint both are undefined, then tracer will initialized with default agent host as Localhost, and udp Port 6831.

{{% callout ref %}}
You can find more information about the Configuration [here](https://github.com/jaegertracing/jaeger-client-java/tree/master/jaeger-core#configuration-via-environment).
{{% /callout %}}

{{% config p="jaeger" %}}
```yaml
jaeger:
  #whether using Jaeger in devMode(boolean).if true trace will not reported to backend Server
  devMode: false
  samplerConfig: 
    #The samplerType(String).valid values are remote (default),ratelimiting, probabilistic,const.
    samplerType: const
    #The samplerParam(Integer) that makes sense for the sampling. 
    samplerParam: 1
    #The http host:port(String) when using the remote controlled sampler.
    samplerManagerHostPort: 128.0.0.1    
  senderConfig:
    #The hostname(String) for communicating with agent via udp.
    agentHost: 127.0.0.1
    #The port(Integer) for communicating with agent via udp.
    agentPort: 6831
    #The traces http endpoint(String),like http://jaeger-collector:14268/api/traces.
    endPoint: http://localhost:14268/api/traces
    #Authentication Token(String) to send as "Bearer" to the http endpoint.
    authToken: myauthtoken
    #Username(String) to send as part of "Basic" authentication to the http endpoint.
    userName: myusername
    #Password(String) to send as part of "Basic" authentication to the endpoint.
    password: mypassword 
  reporterConfig:
    #Whether the reporter should also log the spans(boolean)
    reporterLogSpans: true
    #The reporter's maximum queue size(Integer)
    reporterMaxQueueSize: 10000
    #The reporter's flush interval in miliseconds(Integer)
    reporterFlushInterval: 1000
  codecConfig:
    #Comma separated list of trace formats.Defaults is Jaeger.Valid values are jaeger,b3,w3c
    propagation: jaeger,b3,w3c
  tracerConfig:
    #Opt-in to use 128 bit traceIds. By default, uses 64 bits(boolean).
    traceId128Bit: false
    #The fully qualified class name of the Metrics factory (Optional).(Class<? extends io.jaegertracing.spi.MetricsFactory>)
    metricsFactory:
    #Tracer level tags, which get added to all reported spans.optional
    tracerTags:
      tracerTag1: TracerValue1
      tracerTag2: TracerValue2
```
{{% /config %}}

## Usage

To use a configured Jaeger-addon, simply inject it where needed:

```java
public class SomeClass { 
@Tracing("SomeService") 
private io.opentracing.Tracer tracer1; 
} 
```



## Backend Server and Sampling


Application needs a Jaeger backend Server. A Server deployment includes either the simplest jaeger all-in-one Binary/Docker, or else a distributed system of agents, collectors, and queries.You can find Backend Server and Sampling Strategy information below. 

https://www.jaegertracing.io/download/
 
https://www.jaegertracing.io/docs/1.22/deployment/

https://www.jaegertracing.io/docs/1.22/sampling/
 
Sampling Strategy:  “The const value for JAEGER_SAMPLER_TYPE environment variable configures the Jaeger client sampler to make the same sampling decision for each trace, based on the JAEGER_SAMPLER_PARAM. If the JAEGER_SAMPLER_PARAM is 1, it samples all traces. If the JAEGER_SAMPLER_PARAM is 0, it does not sample any traces. In a production environment, this configuration might cause a lot of overhead on the application and a lower sampling rate can be used. Just look different values for client Sampling Configuration as above “

