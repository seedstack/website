---
title: "Using development snapshots"
author: "Adrien LAUER"
date: 2021-06-01
tags:
    - maven
zones:
    - Guides
noMenu: true
---

Sometimes there is a need to use a development version of a SeedStack component in your project, **for testing purposes**.
This guide will help you configure Maven to access SeedStack SNAPSHOT dependencies.<!--more-->
 
SeedStack Java components are available as Maven dependencies at the following locations:

* Releases are available on [Maven central](http://search.maven.org/).
* Development snapshots are available on [Sonatype OSSRH](https://central.sonatype.org/publish/publish-guide/). To access these snapshots follow this guide.

## Proxy configuration (optional)

In the case where you are behind a corporate proxy, you must configure Maven to go through the proxy. You can do so, by
following [this documentation](https://maven.apache.org/guides/mini/guide-proxies.html).

In your `settings.xml` file you will end with something like this: 

```xml
<settings>
  ...
  <proxies>
   <proxy>
      <id>http-proxy</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>proxy.example.com</host>
      <port>8080</port>
      <username>proxyuser</username>
      <password>somepassword</password>
      <nonProxyHosts>*.example.com</nonProxyHosts>
    </proxy>
   <proxy>
      <id>https-proxy</id>
      <active>true</active>
      <protocol>https</protocol>
      <host>proxy.example.com</host>
      <port>8080</port>
      <username>proxyuser</username>
      <password>somepassword</password>
      <nonProxyHosts>*.example.com</nonProxyHosts>
    </proxy>
  </proxies>
  ...
</settings>
```

## Configuring Maven for SeedStack snapshots

### In the project POM

To configure the snapshots repository for your project only, you need to add the following section to your project POM:

    <repositories>
        <repository>
            <id>oss.sonatype.org-snapshot</id>
            <url>http://oss.sonatype.org/content/repositories/snapshots</url>
            <releases>
                <enabled>false</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>
    </repositories>

### System-wide

Alternatively, you can configure the snapshots repository for all your projects on your computer. To do so, update the global Maven `settings.xml` file which is located by default under `~/.m2/settings.xml` with the following profile:

    <profile>
        <id>sonatype-snapshots</id>
        <repositories>
            <repository>
                <id>oss.sonatype.org-snapshot</id>
                <url>http://oss.sonatype.org/content/repositories/snapshots</url>
                <releases>
                    <enabled>false</enabled>
                </releases>
                <snapshots>
                    <enabled>true</enabled>
                </snapshots>
            </repository>
        </repositories>
    </profile>

You can activate the `sonatype-snapshots` profile on-demand or choose to always enable it by adding the following section to
your `settings.xml` file:

    <activeProfiles>
        <activeProfile>sonatype-snapshots</activeProfile>
    </activeProfiles>

