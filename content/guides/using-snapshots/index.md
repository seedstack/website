---
title: "Using development snapshots"
author: "Adrien LAUER"
date: 2016-02-19
tags:
    - maven
zones:
    - Guides
noMenu: true
---

Sometimes there is a need to use a development version of a SeedStack component in your project, **for testing purposes**.
This guide will help you configure Maven to access SeedStack SNAPSHOT dependencies.<!--more-->
 
SeedStack Java components are available as Maven dependencies at the following locations:

* Releases are available on [Bintray](https://bintray.com/seedstack/jars), [JCenter](https://bintray.com/bintray/jcenter)
 and [Maven central](http://search.maven.org/).
* Development snapshots are available on [JFrog OSS Artifactory](https://oss.jfrog.org/artifactory/webapp/#/artifacts/browse/simple/General/oss-snapshot-local/org/seedstack).

## Proxy configuration

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

You can configure access to SeedStack snapshots located on JFrog OSS Artifactory. You can do this either specifically for
a project or globally in your system-wide Maven settings.

### Project-specific

To access snapshots, you need to add the following repository definitions to your project POM:

    <repositories>
        <repository>
            <id>ojo-libs-snapshot</id>
            <name>ojo-snapshots</name>
            <url>https://oss.jfrog.org/artifactory/libs-snapshot</url>
            <releases>
                <enabled>false</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>
    </repositories>
    <pluginRepositories>
        <pluginRepository>
            <id>ojo-libs-snapshot</id>
            <name>ojo-snapshots</name>
            <url>https://oss.jfrog.org/artifactory/libs-snapshot</url>
            <releases>
                <enabled>false</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </pluginRepository>
    </pluginRepositories>

{{% callout info %}}
Note that the `<pluginRepositories>` section is only needed if you want use development snapshots of [SeedStack Maven
plugin](http://seedstack.org/docs/seed/maven-plugin/).
{{% /callout %}}

### System-wide configuration

Update your Maven `settings.xml` file which is located by default under `~/.m2/settings.xml` with the following profile:

    <profile>
        <id>ojo-snapshots</id>
        <repositories>
            <repository>
                <id>ojo-libs-snapshot</id>
                <name>ojo-snapshots</name>
                <url>https://oss.jfrog.org/artifactory/libs-snapshot</url>
                <releases>
                    <enabled>false</enabled>
                </releases>
                <snapshots>
                    <enabled>true</enabled>
                </snapshots>
            </repository>
        </repositories>
        <pluginRepositories>
            <pluginRepository>
                <id>ojo-libs-snapshot</id>
                <name>ojo-snapshots</name>
                <url>https://oss.jfrog.org/artifactory/libs-snapshot</url>
                <releases>
                    <enabled>false</enabled>
                </releases>
                <snapshots>
                    <enabled>true</enabled>
                </snapshots>
            </pluginRepository>
        </pluginRepositories>
    </profile>

{{% callout info %}}
Similarly to project-specific configuration, the `<pluginRepositories>` section is only needed if you want use development
snapshots of [SeedStack Maven plugin](http://seedstack.org/docs/seed/maven-plugin/).
{{% /callout %}}

You can activate the `ojo-snapshots` profile on-demand or choose to always enable it by adding the following section to
your `settings.xml` file:

    <activeProfiles>
        <activeProfile>ojo-snapshots</activeProfile>
    </activeProfiles>

