---
title: "Package goal"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedMavenPlugin"
menu:
    SeedMavenPlugin:
        weight: 40
---

The `package` goal packages any self-executable SeedStack application in a [Capsule](http://www.capsule.io/).
A Capsule is a way of packaging and running any application with all its dependencies from a unique plain executable JAR.

{{% callout info %}}
Self-executable SeedStack application are applications that contains one and only one implementation of the {{< java "org.seedstack.seed.spi.SeedLauncher" >}}
interface in their classpath, like the one provided by the `seed-cli` module (for command-line application) or the `seed-web-undertow`
module (for embedded Web applications).
{{% /callout %}}

# Parameters

Parameters should be given as system properties (`-DparameterName=parameterValue`):

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
        <td>light</td>
        <td>-</td>
        <td>No</td>
        <td>
            If this parameter is specified (no value is necessary), a lightweight Capsule will be built instead of a standalone one.
            A lightweight Capsule will download its dependencies through Maven the first time it is run.
        </td>
    </tr>
    <tr>
        <td>capsuleVersion</td>
        <td>String</td>
        <td>No</td>
        <td>The capsule version to be usedThe string of all arguments used to run the Seed application.</td>
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

## Lightweight Capsule

A lightweight Capsule rely on Maven to download its dependencies the first time it is run. To build such a Capsule, use
the following command:

    mvn org.seedstack:seedstack-maven-plugin:package -Dlight

{{% callout warning %}}
Note that you will need a fully configured Maven environment on the machine you want to the run a lightweight Capsule on.
It is NOT recommended for production environment as it introduce a potential variability at execution time (should a
dependency contents change for instance).
{{% /callout %}}

# Running a capsule

To run a capsule, you simply execute it as a plain executable JAR:

    java [jvm-args] -jar my-capsule.jar [args...]

You can specify any argument to the JVM or to the program as usual.

{{% callout tips %}}
A lot of options can be specified to alter the default behavior of the Capsule itself. Please refer to the [Capsule user-guide](http://www.capsule.io/user-guide/)
for more information.
{{% /callout %}}