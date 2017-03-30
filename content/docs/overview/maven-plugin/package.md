---
title: "Package goal"
type: "home"
zones:
    - "Overview"
sections:
    - "OverviewMavenPlugin"
tags:
    - maven
menu:
    OverviewMavenPlugin:
        weight: 40
---

The `package` goal packages any self-executable SeedStack application in a [Capsule](http://www.capsule.io/).
A Capsule is a way of packaging and running any application with all its dependencies from a unique plain executable JAR.<!--more-->

{{% callout info %}}
Self-executable SeedStack application are applications that contains one and only one implementation of the {{< java "org.seedstack.seed.spi.SeedLauncher" >}}
interface in their classpath, like the one provided by the `seed-cli` module (for command-line application) or the `seed-web-undertow`
module (for embedded Web applications).
{{% /callout %}}

# Parameters

Parameters can be given as system properties (`-DparameterName=parameterValue`) or specified in the `pom.xml` plugin declaration:

<table class="table table-striped table-bordered table-condensed">
    <thead>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Mandatory</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>capsuleVersion</td>
        <td>String</td>
        <td>No</td>
        <td>The capsule version to be used. If not given, the latest version discoverable is automatically used.</td>
    </tr>
    <tr>
        <td>classpathEntries</td>
        <td>List of strings</td>
        <td>No</td>
        <td>The classpath entries to add to the application classpath. Relative paths are resolved to the location of the capsule JAR. The current user home path (~) can be used.</td>
    </tr>
    <tr>
        <td>systemProperties</td>
        <td>List of strings</td>
        <td>No</td>
        <td>The system properties to set when launching the application.</td>
    </tr>
    <tr>
        <td>environmentVariables</td>
        <td>List of strings</td>
        <td>No</td>
        <td>The environment variables to set when launching the application.</td>
    </tr>
    <tr>
        <td>jvmArgs</td>
        <td>List of strings</td>
        <td>No</td>
        <td>The JVM arguments to apply when launching the application.</td>
    </tr>
    <tr>
        <td>allowSnapshots</td>
        <td>-</td>
        <td>No</td>
        <td>If specified, the Capsule will allow SNAPSHOT dependencies to be used.</td>
    </tr>
    </tbody>
</table>

# Examples

## Standalone Capsule

A standalone Capsule packs all its dependencies and is completely self-contained. It is the default mode of operation. To
build such a Capsule, use the following command:

    mvn org.seedstack:seedstack-maven-plugin:package

# Running a capsule

To run a capsule, you simply execute it as a plain executable JAR:

    java [jvm-args] -jar my-capsule.jar [args...]

In addition to any argument already specified in the capsule manifest (with the plugin parameters described above), you can specify any argument to the JVM or to the program as usual.

{{% callout tips %}}
A lot of options can be specified to alter the default behavior of the Capsule itself. Please refer to the [Capsule user-guide](http://www.capsule.io/user-guide/)
for more information.
{{% /callout %}}
