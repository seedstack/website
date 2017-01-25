---
title: "Requirements"
type: "home"
zones:
    - "Overview"
sections:
    - "OverviewEssentials"
menu:
    OverviewEssentials:
        weight: 40
---


SeedStack is designed to work equally well and provide the same level of features in a standalone environment or in
managed environment like a Servlet container or a JEE application server.<!--more-->

# Java

**Starting from SeedStack 16.11, Java 8 is required.** SeedStack 16.7 is still maintained and is the latest version
compatible with Java 6, 7 and 8.

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
A JEE container is **NOT** necessary to run SeedStack Java applications but can be used if necessary.
{{% /callout %}}

# Tested environments

Key features of the Java framework and its add-ons are automatically tested in several runtime environments. The table
below details the testing results.

{{% smoke-tests %}}

{{% callout info %}}
{{< figure src="/img/docker.png" class="pull-right docker" >}}
These tests are done with docker containers, using the latest official image of the runtime environments. For more
information, have a look a [the smoke-tests repository](https://github.com/seedstack/smoke-tests).
{{% /callout %}}
