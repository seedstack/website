---
title: "Runtime"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedRuntime"
---

The SeedStack Java framework is designed to work equally well and provide the same level of features in a standalone or
a managed environment.

# Java

The Java framework is tested and compatible with the following versions of Java:

* Java 6 (minimum required version),
* Java 7,
* Java 8.

{{% callout info %}}
Please note that some add-ons may require a minimum version of greater than Java 6.
{{% /callout %}}


# Web

When used in a Web environment, the Java framework only requires a **standard Servlet 3+ container**.

## Embedded Servlet container

An embedded Servlet container, based upon [Undertow](http://undertow.io), is provided with the following dependency:

{{< dependency g="org.seedstack.seed" a="seed-web-undertow" >}}

It is lightweight, robust, very fast and can be used to produce full-fledged Web applications packaged in [standalone
executable JARs](/docs/seed/maven-plugin/package).

## External Servlet container

Should you require the usage of an external Servlet container like Tomcat, the Java framework is automatically tested and
fully compatible with several popular Servlet containers, listed below.

{{% callout tips %}}
A JEE container is **NOT** necessary for running SeedStack Java applications but can be used if needed.
{{% /callout %}}

# Tests

Key features of the Java framework and its add-ons are automatically tested in several runtime environments. The table
below details the testing results.

{{% smoke-tests %}}

{{% callout info %}}
{{< figure src="/img/docker.png" class="pull-right docker" >}}
These tests are done with docker containers, using the latest official image of the runtime environments. For more
information, have a look a [the smoke-tests repository](https://github.com/seedstack/smoke-tests).
{{% /callout %}}
