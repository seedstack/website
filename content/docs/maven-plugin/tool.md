---
title: "Tool goal"
type: "home"
zones:
    - "Docs"
tags:
    - maven
aliases: /docs/maven-plugin/manual/tool    
menu:
    docs:
        parent: "maven"
        weight: 50
---

The `tool` goal will execute the project in [tool mode](/docs/seed/manual#tool-mode) instead of its normal mode. <!--more-->
It will execute the tool specified as the first argument in the `args` parameter. Further arguments and options depend
upon each tool.

## Parameters

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
        <td>The string of all arguments used to run the tool. <br><strong>The first argument must be the tool name.</strong></td>
    </tr>
    </tbody>
</table>

## Examples

### Execute config tool without options

The config tool is a built-in tool that can be used to dump all the project configuration options: 

```bash
mvn -Dargs="config" org.seedstack:seedstack-maven-plugin:tool
```

Note that the `config` tool name is provided as the first argument inside the `args` system property. 

### Execute config tool with arguments

You can further specify arguments and options (which depend upon the executed tool). In the following example we want 
information about the `application.id` particular configuration property: 

```bash
mvn -Dargs="config application.id" org.seedstack:seedstack-maven-plugin:tool
```
