---
title: "Core overview"
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

SEED core provides the following :

* application lifecycle management
* dependency injection
* configuration
* various common framework functionality

<div class="callout callout-info">
Note that SEED detects automatically a large set of code structures, conventions and annotations by scanning the 
classpath. To avoid scanning unnecessary files, it restricts itself by default to:

<ul>
    <li>Every package starting with <code>org.seedstack</code>,</li>
    <li>Every props or properties configuration files within <code>META-INF/configuration</code>.</li>
</ul>

<p>Additional locations may be scanned automatically if you enable some supports. You will probably need to add your own 
locations for Seed to scan your code. For this you need to add a <code>seed-bootstrap.properties</code> file under the 
<code>META-INF</code> directory of the classpath with the following property:</p>

<pre>
    package-roots = org.my.package, com.my.other.package, ...
</pre>

</div>

A maven dependency is rarely required since **SEED core is a dependency of all other supports**. Nevertheless, the 
following dependency snippet allows you to import SEED core on its own:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-core-support-core</artifactId>
    </dependency>

If only SEED core specification is required (without any implementation), use the following dependency snippet instead:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-core-support-specs</artifactId>
    </dependency>
