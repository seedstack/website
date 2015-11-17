---
title: "Logging"
guide: "Make a configurable application"
author: "SeedStack"
menu:
    ConfigurationGuide:
        weight: 20
---

Logging configuration is a very good candidate for externalisation, since it will allow to change the log level of
various components after deployment and even when the application is running if configured properly. Logging configuration
is often centralized in one file which can be wholly externalised without any risks. Logging is a purely technical
aspect of applications and can be entirely managed by the people in charge of the runtime environment.

Note that Seed applications are using the SLF4J logging API but are not usually dependant of a specific implementation. 
Nonetheless, we recommend using the Logback implementation because of its powerful configuration options and good 
runtime performance.

# Logback

The recommended SLF4J implementation for Seed applications is Logback. It is mainly configurable through an XML file
named `logback.xml` that must present in the classpath in the default package (e.g. as a top-level resource). 

{{% callout info %}}
We strongly recommend that you include Seed default configuration for Logback by adding the following line in your 
`logback.xml` file:

    <include resource="org/seedstack/logback-defaults.xml"/>
{{% /callout %}}

To properly externalise your `logback.xml` file, you have three options:

* Add a `logback.xml` file in a directory that will be added to the classpath BEFORE other classpath entries and as
such will override any internal version of the file. This option is **RECOMMENDED in production**.
* Exclude `logback.xml` from being packaged in the application. As such the application will only log if you add a 
`logback.xml` file to the classpath whatever the position of this classpath entry. The main drawback is that the
application won't log anything without an external logback configuration file, so it is **NOT RECOMMENDED in production**.
* Set the system property `logback.configurationFile` to the path of the `logback.xml` file. This will override any
classpath version of the file. This property also accepts a classpath resource path (if you want to place your file
elsewhere in the classpath) or to an accessible URL. While this option can be useful for testing purposes and temporary
overrides, it is **NOT RECOMMENDED in production**.

{{% callout warning %}}
Be sure that you have no <code>logback-test.xml</code> file in your main classpath or it will be picked by Logback instead
of the <code>logback.xml</code> file. It can happen if you placed the test file in the main sources of your project instead
of keeping it in the test folders.
{{% /callout %}}

You can find the full documentation about Logback configuration [here](http://logback.qos.ch/manual/configuration.html).
