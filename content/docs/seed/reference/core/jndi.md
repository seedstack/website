---
title: "JNDI"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedCore"
tags:
    - "jndi"
    - "api"
menu:
    SeedCore:
        weight: 30
---

SEED provides the ability to inject external JNDI resources through the `@Resource` annotation. Multiple JNDI contexts can
be used in an application by using the `@FromContext` annotation.

# Declaring JNDI contexts

The default JNDI context is automatically configured by SEED if you provide a `jndi.properties` file in `META-INF/configuration` classpath-included folder. 
This JNDI context is named `default` by SEED.

Additional JNDI contexts can be specified using the following configuration properties:

    additional-jndi-contexts = additional1, additional2
    additional-jndi-context.additional1 = /jndi-ctx-1.properties
    additional-jndi-context.additional2 = /jndi-ctx-2.properties

The above code defines two additional JNDI contexts, named `additional1` and `additional2`. The specified properties
files are `jndi.properties`-like files.

# Using JNDI context

## Declarative API

You can inject JNDI resource using the `@Resource` annotation from JSR-245:

    public class Holder{
        @Resource(name = "THE_JNDI_NAME")
        private DataSource datasource;
    }

The above lookup for `THE_JNDI_NAME` in `default` JNDI context is injected into `datasource` attribute. 

In case you have several JNDI contexts in your application, you can specify the context name as follows:

    public class Holder{
        @Resource(name = "THE_JNDI_NAME")
        @FromContext("additional1")
        private DataSource datasource;
    }

## Programmatic API

You can retrieve any context by injecting it into your code. Then you can use the JNDI programmatic API to lookup
for resources in that context.

You can inject the `default` context as follows:

    public class Holder{
        @Inject
        private Context defaultCtx;

        public void m(){
           MyJNDIResource test = defaultCtx.lookup("THE_JNDI_NAME");
        }
    }

If you need to precise another context, you can specify the context as follows:

    public class Holder{
        @Inject
        @Named("additional1")
        private Context additional1;

        public void m(){
           MyJNDIResource test = additional1.lookup("THE_JNDI_NAME");
        }
    }
