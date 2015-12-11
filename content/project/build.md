---
title: "Build"
type: "home"
zones:
    - "Project"
sections:
    - "ProjectBuild"
smokeUrl: "http://seedstack.github.io/smoke-tests"
---

{{% callout info %}}
{{< figure src="/img/docker.png" class="pull-right docker" >}}
All compatibility tests have been done with docker containers.
{{% /callout %}}

SeedStack is automatically tested against several runtime environment which are listed on this page with the corresponding
results.

# Tested Features

* JPA with persistence.xml file
* JPA with Seed configuration (in a props file so without persistence.xml)
* Basic REST test

Other tests and other application servers will be added in the future.
 
# Application Servers

{{% as-build %}}

# Notes

{{% as-notes %}}
