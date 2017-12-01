---
title: "Effective config goal"
type: "home"
zones:
    - "Docs"
tags:
    - maven
aliases: /docs/maven-plugin/manual/effective-config    
menu:
    docs:
        parent: "maven"
        weight: 70
---

The `effective-config` goal produces a YAML dump of the configuration as scanned, parsed and aggregated by SeedStack. <!--more-->
This will show the global configuration as the application sees it.

{{% callout tips %}}
This goal executes the [effective-config tool](/docs/seed/configuration/#effective-configuration) on 
the project. It is a shortcut for the [tool goal](../tool) with `effective-config` specified as first argument. 
{{% /callout %}}

## Parameters

No parameters are accepted by this goal.

## Example

```bash
mvn -q org.seedstack:seedstack-maven-plugin:effective-config
```
