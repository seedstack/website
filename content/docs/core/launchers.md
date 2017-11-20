---
title: "Launchers"
type: "home"
zones:
    - "Docs"
tags:
    - cli
menu:
    docs:
        parent: "core"
        weight: 3
---

Running a SeedStack application is done by using the {{< java "org.seedstack.seed.core.SeedMain" >}} class 
as entry point. This main class searches for a **launcher** on the classpath and delegates the startup and shutdown
logic to it. A launcher is a class implementing {{< java "org.seedstack.seed.spi.SeedLauncher" >}}. 

SeedStack provides two built-in launchers:

* In the `seed-cli` module, for [command-line applications]({{< ref "docs/core/cli.md" >}}).
* In the `seed-web-undertow`, for [Web applications]({{< ref "docs/web/index.md" >}}) embedding their own server.

{{% callout info %}}
Web applications executed in a Servlet container don't require a launcher as they are completely managed by the container.
See [this page]({{< ref "docs/web/index.md#in-a-container" >}}) for more information.
{{% /callout %}} 

## Startup

### Plain command-line

A standalone application is run from the command-line using the {{< java "org.seedstack.core.SeedMain" >}}
class:

```bash
java [jvm-args] -cp ... org.seedstack.core.SeedMain [app-args]
```

### Capsule

One difficulty of running a Java application from the command line is to properly set its classpath. To simplify this
task, SeedStack provides the ability to package any project in a [Capsule](http://www.capsule.io/), which is a sophisticated
one-JAR packager and launcher. With a Capsule, launching the application becomes as simple as:

```bash
java [jvm-args] -jar app-capsule.jar [app-args]
```

{{% callout info %}}
SeedStack projects created by the generator always provide a Capsule JAR in the `target` directory. Check the 
[package goal]({{< ref "docs/maven-plugin/package.md" >}}) of the SeedStack maven plugin for more information.  
{{% /callout %}}
 
### Maven run goal

In development, you have the ability to run a standalone application directly from Maven with the [run goal]({{< ref "docs/maven-plugin/run.md" >}}) 
of the SeedStack Maven plugin:

```bash
mvn [-Dargs="app-args"] seedstack:run
```

This will automatically build the classpath from the project dependencies and create an isolated classloader to run the
application.

## Shutdown 
    
To shutdown a standalone application, you simply have to gracefully stop the JVM. You can do this on any operating system 
this by hitting `CTRL+C` if the JVM is a foreground process. You can also do this on UNIX systems if the JVM is a 
background process by issuing a `SIGINT` signal to the JVM process:
 
```bash
kill -2 pid
```
    
Before the JVM stops, the shutdown logic of the SeedStack application will be invoked.
     
{{% callout warning %}}
Warning! If you abruptly terminate or kill the JVM process, the application will NOT gracefully shutdown.  
{{% /callout %}}    

## Tool mode

A SeedStack application can be run in tool mode. In this case a special launcher is invoked and will execute the specified
tool. You can run any module in tool mode by specifying the `seedstack.tool` system property:
 
```bash
java [jvm-args] -Dseedstack.tool=toolName -cp ... org.seedstack.core.SeedMain [tool-args]
```

or with a Capsule:

```bash
java [jvm-args] -Dseedstack.tool=toolName -jar app-capsule.jar [tool-args]
```

{{% callout tips %}}
The [tool goal]({{< ref "docs/maven-plugin/tool.md" >}}) of the SeedStack Maven plugin can run a tool directly from Maven.

You can also run a tool from your IDE by executing the {{< java "org.seedstack.seed.core.SeedMain" >}} main class with
the `-Dseedstack.tool=<toolName>` JVM argument. You can use the program arguments to specify the arguments of the tool.
{{% /callout %}}

## Lifecycle listener

You can implement the {{< java "org.seedstack.seed.LifecycleListener" >}} interface to be notified about the application
lifecycle events:

```java
public class MyLifecycleListener implements LifecycleListener {
    @Logging
    private Logger logger;

    @Override
    public void started() {
        logger.info("Application has been started");
    }

    @Override
    public void stopping() {
        logger.info("Application is about to be stopped");
    }
}
```

Such classes are injectable and can be used to implement initialization and shutdown logic.
