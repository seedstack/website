---
title: "CORS"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedWeb"
tags:
    - "web"
    - "configuration"
    - "cors"
    - "filter"
menu:
    SeedWeb:
        weight: 50
---

Cross-Origin Resource Sharing (CORS) is supported through a Java filter and can be enabled in any SEED application.

<div class="callout callout-info">
SEED integrates the CORS filter from <a href="http://software.dzhuvinov.com/cors-filter.html">[d]zhuvinov  [s]oftware</a>.
There is no need to install and configure the filter manually, it is automatically registered by SEED. All
filter options can be specified by configuration properties.
</div>


# Configuration

To enable CORS support just add the following configuration to your application:

    org.seedstack.seed.web.cors.enabled = true

# Filter properties

The CORS filter allows to alter its default behavior with various parameters. The filter documentation enumerates all
configuration parameters. SEED can transform any configuration property prefixed with `org.seedstack.seed.web.cors.property`
to the corresponding filter parameter. For instance, to specify the recognized verbs, you can use the following configuration:

    org.seedstack.seed.web.cors.property.supportedMethods= GET\\, POST\\, HEAD\\, OPTIONS\\, PUT\\, DELETE

This configuration property is automatically translated to the `cors.supportedMethods` filter parameter found in the
documentation. Note that the escaping of the commas is required to inhibit SEED from parsing this value as a list and
forward this value as-is to the filter.

<div class="callout callout-info">
Please refer to this page of the <a href="http://software.dzhuvinov.com/cors-filter-configuration.html">filter documentation</a>
for a complete list of configuration parameters.
</div>
