---
title: "Logging"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedEssentials"
tags:
    - "logging"
menu:
    SeedEssentials:
        weight: 40
---

Logging is a necessity in almost any application. SeedStack standardize logging through the popular [SLF4J logging facade](http://www.slf4j.org)
but the actual implementation is chosen at the project level. 

# Recommended implementation

SeedStack is compatible with any SLF4J implementation but we recommend [Logback](https://logback.qos.ch/) as an efficient, 
natural fit for SLF4J. To add Logback to your project, use the following dependency snippet:

{{< dependency g="ch.qos.logback" a="logback-classic" >}}

# Usage
 
You can inject a logger in any class by annotating an SLF4J logger field with `@Logging`:

```java
class SomeClass {
    @Logging
    private Logger logger;
}
```

This will automatically inject a logger for the enclosing class. This also works on static fields but if you want 
your logger fields to be final, you must use the traditional SLF4J syntax instead:
    
```java
class SomeClass {
    private static final Logger LOGGER = LoggerFactory.getLogger(SomeClass.class);
}
```

# Configuration

SeedStack supports any SLF4J implementation but can automatically configure Logback. If you want to use another 
implementation you have to use its native configuration mechanism.

## Automatic configuration

A default configuration mechanism is provided. If you don't specify any configuration, it will be auto-configured to the 
following settings:

* A root logger level set to INFO,
* A console appender outputting to `System.out` (standard output),
* A color output (only if supported by the environment),
* The following pattern for the console appender:

```plain
%highlight(%-5level) [%d{ISO8601}] %magenta(%-8thread) %cyan(%-30logger{30}) %msg%n%red(%throwable)
```

For supported SLF4J implementations (currently only Logback), you can easily change the logging system configuration
with the following options:
 
{{% config p="logging" %}} 
```yaml
logging:
  # Logging level of the root logger
  level: (ERROR|WARN|INFO|DEBUG|TRACE)
  
  # The pattern for the default console appender
  pattern: (String)
  
  loggers:
    org.seedstack.samples.logging.SampleLogger:
      # Logging level for this specific logger
      level: (ERROR|WARN|INFO|DEBUG|TRACE)     
      
      # Additivity for this specific logger
      additive: (boolean)  
``` 
{{% /config %}} 

{{% callout info %}}
This automatic configuration is enough for most development needs. It may also be adequate for running in cloud environments
where the standard output is typically redirected to a log collector. If you need more control, check
out the native configuration of you implementation below.
{{% /callout %}}
 
## Native configuration

For advanced needs, you can still use the native configuration mechanism of the chosen SLF4J implementation. In this case, 
it will completely override any automatic configuration.

