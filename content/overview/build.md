---
title: "FAQ"
type: "home"
zones:
    - "Overview"
sections:
    - "OverviewBuild"
menu:
    OverviewBuild:
        weight: 10
smokeUrl: "http://seedstack.github.io/smoke-tests"
---

{{% callout info %}}
{{< figure src="/img/docker.png" class="pull-right docker" >}} 
All compatibility tests have been done with docker containers. 
{{% /callout %}}

**The goal is to test SeedStack with different application servers**

# Tested Features

* JPA with persistence.xml file
* JPA with Seed configuration (in a props file so without persistence.xml)
* Basic REST test

Other tests and other application servers will be added in the future.
 
# Application Servers

{{% as-build %}}

# Notes

{{% as-notes %}}
