---
title: "Effective test config goal"
type: "home"
zones:
    - "Overview"
sections:
    - "OverviewMavenPlugin"
tags:
    - "config"
    - "maven"
    - "plugin"
menu:
    OverviewMavenPlugin:
        weight: 80
---

The `effective-test-config` goal produces a YAML dump of the **test** configuration as scanned, parsed and aggregated by SeedStack. <!--more-->
This will show the global configuration as the application sees it, including the test classpath.

{{% callout warning %}}
This goal executes the [effective-config tool](/docs/seed/configuration/#effective-configuration) on 
the project. **This is not the same as running it using the [tool goal](../tool) as the latter doesn't include the 
test classpath.**
{{% /callout %}}

# Parameters

No parameters are accepted by this goal.

# Example

```bash
mvn -q org.seedstack:seedstack-maven-plugin:effective-test-config
```
