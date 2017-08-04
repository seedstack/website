---
title: "Config goal"
type: "home"
zones:
    - "MavenPlugin"
sections:
    - "MavenPluginManual"
tags:
    - maven
menu:
    MavenPluginManual:
        weight: 60
---

The `config` goal dumps all the configuration options available in the project. <!--more-->

{{% callout tips %}}
This goal executes the [config tool](/docs/seed/configuration/#configuration-options-dump) on the project.
It is a shortcut for the [tool goal](../tool) with `config` specified as first argument.
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
        <td>args</td>
        <td>String</td>
        <td>Yes</td>
        <td>The string of all arguments passed to the config tool.</td>
    </tr>
    </tbody>
</table>

# Examples

## Dump all the configuration options

```bash
mvn -q org.seedstack:seedstack-maven-plugin:config
```

## Detail a specific configuration option

```bash
mvn -Dargs="application.id" -q org.seedstack:seedstack-maven-plugin:config
```
