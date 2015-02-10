SEED core provides the following :

* application lifecycle management
* dependency injection
* configuration
* various common framework functionality

<div class="callout callout-info">
Note that SEED detects automatically a large set of code structures, conventions and annotations by scanning the 
classpath. To avoid scanning unnecessary files, it restricts itself to several key locations:

<ul>
    <li>Every package starting with <code>com.inetpsa</code>,</li>
    <li>Every props configuration files within <code>META-INF/configuration</code>.</li>
</ul>

Some additional locations can be scanned depending on the enabled supports. Ensure that the code or the files that need 
to be scanned and detected by SEED is in one of those locations.
</div>

A maven dependency is rarely required since **SEED core is a dependency of all other supports**. Nevertheless, the 
following dependency snippet allows you to import SEED core on its own:

    <dependency>
        <groupId>com.inetpsa.fnd.seed</groupId>
        <artifactId>seed-core-support-core</artifactId>
    </dependency>

If only SEED core specification is required (without any implementation), use the following dependency snippet instead:

    <dependency>
        <groupId>com.inetpsa.fnd.seed</groupId>
        <artifactId>seed-core-support-specs</artifactId>
    </dependency>
