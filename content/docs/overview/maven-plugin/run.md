---
title: "Run goal"
type: "home"
zones:
    - "Overview"
sections:
    - "OverviewMavenPlugin"
tags:
    - "maven"
    - "plugin"
    - "running"
    - "executable"
menu:
    OverviewMavenPlugin:
        weight: 30
---

The `run` goal runs any self-executable SeedStack application directly from the command line.<!--more-->

{{% callout info %}}
Self-executable SeedStack applications are applications that contains one and only one implementation of the {{< java "org.seedstack.seed.spi.SeedLauncher" >}}
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
        <td>args</td>
        <td>String</td>
        <td>No</td>
        <td>The string of all arguments used to run the Seed application.</td>
    </tr>
    </tbody>
</table>

# Examples

## Web application

By running the following command on a SeedStack application containing the `seed-web-undertow` dependency (like the
[catalog micro-service sample](https://github.com/seedstack/catalog-microservice-sample)), you will startup the application
with its embedded [Undertow Web server](http://undertow.io/):

    mvn org.seedstack:seedstack-maven-plugin:run

## CLI application

By running the following command on a SeedStack application containing the `seed-cli` dependency (like the
[batch sample](https://github.com/seedstack/samples/tree/master/batch)), you will startup the application with the
corresponding arguments:

    mvn seedstack:run -Dargs="run-job --job helloWorldJob"

{{% callout info %}}
Note that a SeedStack CLI application needs at least one {{< java "org.seedstack.seed.cli.CommandLineHandler" >}} in the
classpath which name must be specified as an argument. In this example we assume that the [SeedStack Spring bridge add-on](http://seedstack.org/addons/spring-bridge/batch)
`run-job` command-line handler is also present in the classpath.
{{% /callout %}}
