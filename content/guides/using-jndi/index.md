---
title: "Using JNDI"
author: "Adrien LAUER"
date: 2017-03-24
zones:
    - Guides
noMenu: true
---

SeedStack provides the ability to inject JNDI resources. Multiple JNDI contexts can be used in an application.<!--more-->

## Configuration

The default JNDI context is automatically configured by SeedStack if you provide a `jndi.properties` file at the root
of the classpath. This JNDI context is named `default`. Additional JNDI contexts can be specified using the following 
configuration:

{{% config p="jndi" %}}
```yaml
jndi:
  # Configured additional JNDI context with the name context as key
  additionalContexts:
    otherContext: other-context.properties
```
{{% /config %}}

The above configuration defines an additional JNDI context, named `otherContext`. It is defined by the JNDI properties file loaded
from the classpath location `other-context.properties`. 

## Usage

### Declarative API

You can inject a JNDI resource from the default context using the standard {{< java "javax.annotation.Resource" "@" >}} 
annotation:

```java
public class SomeClass {
    @Resource(name = "some/jndi/name")
    private DataSource datasource;
}
```

In case you have several JNDI contexts in your application, you can specify the context name using the {{< java "org.seedstack.seed.JndiContext" "@" >}}
annotation:

```java
public class SomeClass {
    @Resource(name = "some/jndi/name")
    @JndiContext("otherContext")
    private DataSource datasource;
}
```

### Programmatic API

You can retrieve any JNDI context by injecting the {{< java "javax.naming.Context" >}} interface where required:

```java
public class SomeClass {
    @Inject
    private Context defaultContext;

    public void someMethod(){
       defaultContext.lookup("some/jndi/name");
    }
}
```

If you need to inject a specific context, qualify the injection point with the {{< java "javax.inject.Named" "@" >}} annotation:

```java
public class Holder{
    @Inject
    @Named("otherContext")
    private Context otherContext;

    public void someMethod(){
       otherContext.lookup("some/jndi/name");
    }
}
```
