---
title: "Overview"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedCore"
tags:
    - "maven"
    - "package"
    - "bootstrap"
    - "classpath-scan"
menu:
    SeedCore:
        weight: 10
---

Seed core provides the following :

* application lifecycle management
* dependency injection
* configuration
* various common framework functionality

{{% callout info %}}
Note that Seed detects automatically a large set of code structures, conventions and annotations by scanning the 
classpath. To avoid scanning unnecessary files, it restricts itself by default to:

* Every package starting with `org.seedstack`,
* Every props or properties configuration files within `META-INF/configuration`.

Additional locations may be scanned automatically if you enable some supports. You will probably need to add your own 
locations for Seed to scan your code. For this you need to add a `seed-bootstrap.properties` file under the 
`META-INF` directory of the classpath with the following property:

```plain
package-roots = org.my.package, com.my.other.package, ...
```

{{% /callout %}}

A maven dependency is rarely required since **Seed core is a dependency of all other supports**. Nevertheless, the 
following dependency snippet allows you to import Seed core on its own:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-core-support-core</artifactId>
    </dependency>

If only Seed core specification is required (without any implementation), use the following dependency snippet instead:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-core-support-specs</artifactId>
    </dependency>
