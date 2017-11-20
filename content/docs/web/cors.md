---
title: "CORS"
type: "home"
zones:
    - "Docs"
tags:
    - web
    - interfaces
menu:
    docs:
        weight: 7
        parent: "web"

---

Cross-Origin Resource Sharing (CORS) is supported through a Java filter and can be enabled in any Seed application.

{{% callout info %}}
Seed integrates the CORS filter from [dzhuvinov software](http://software.dzhuvinov.com/cors-filter.html). There is no 
need to install and configure the filter manually, it is automatically registered by Seed. All filter options can be 
specified through configuration properties.
{{% /callout %}}

## Configuration

CORS can be enabled and configuration as below:

{{% config p="web.cors" %}}
```yaml
web:
    cors:
      # The servlet path mapping on which CORS will be active
      path: (String)
     
      # If true, Cross-Origin-Resource-Sharing (CORS) will be enabled
      enabled: (boolean)
      
      # Allows to specify custom properties to the CORS filter
      properties: 
        key: (String)
```
{{% /config %}}

{{% callout ref %}}
CORS filters properties can be specified according to [its documentation](http://software.dzhuvinov.com/cors-filter-configuration.html#section-1),
but without the `cors.` prefix (e.g. `tagRequests`, `supportedMethods`, ...).
{{% /callout %}}

