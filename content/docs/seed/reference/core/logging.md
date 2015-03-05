---
title: "Logging"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedCore"
tags:
    - "logging"
    - "slf4j"
    - "logback"
menu:
    SeedCore:
        weight: 40
---

SEED uses and provides integration for the slf4j logging API.

# Using a logger

In any SEED managed instance, you can inject a logger by using the @Logging annotation:

    package my.package;

    public class Holder {
        @Logging
        private Logger logger;

        public void m(){
            logger.info("in method m");
        }
    }

The previous code will inject a SLF4J logger facade in the `logger` field, named after the enclosing class (i.e. `my.package.Holder`). 
You can still use the `LoggerFactory.getLogger(Holder.class)` call to achieve the same result when you are not in a
SEED managed instance or for other reasons. Eg. any class not instantiated by SEED or that can (or should) not be managed after instantiation.

# Recommended implementation

The logback implementation of SLF4J is recommended for the vast majority of applications. This combination is very
efficient and configurable. To use it in your project, just use below maven dependency snippet (The version is automatically 
managed by SEED if not specified but can be overridden).

    <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
    </dependency>

You can use the following minimalist configuration file, named logback.xml, in your application classpath (eg. `src/main/ressources`):

    <?xml version="1.0"?>
    <configuration>
        <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
            <encoder>
                <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
            </encoder>
        </appender>
        <root level="INFO">
            <appender-ref ref="STDOUT" />
        </root>
    </configuration>

This will provide standard out console logging at the info level for all your application components. You can greatly
customize this file to your needs following the documentation available [here](http://logback.qos.ch/manual/index.html).