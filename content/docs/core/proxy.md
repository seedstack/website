---
title: "Proxy"
type: "home"
zones:
    - "Docs"
sections:
    - "Manual"    
menu:
    docs-manual:
        weight: 10
        parent: "core"
---

SeedStack has the ability to setup the JVM-wide proxy from configuration and/or environment variables.

{{% callout warning %}}
Basic authentication HTTPS tunneling is disabled by default, starting from Java 8u111. This means that HTTPS proxies relying
on basic authentication won't work out of the box. 

To re-enable the basic scheme, remove the `Basic` term from the `jdk.http.auth.tunneling.disabledSchemes` system property,
by setting it to empty or any relevant value. 

More details at https://www.oracle.com/technetwork/java/javase/8u111-relnotes-3124969.html.
{{% /callout %}}

## Environment variables

SeedStack will automatically configure the JVM proxy if the following environment variables are detected:

Variables `http_proxy` and `https_proxy` for, respectively, HTTP and HTTPS protocol proxying:

```plain
http://[user[:password]@]proxy.example.com[:80]
```

Default port is 80 for HTTP proxying and 443 for HTTPS proxying. Variable `no_proxy` for a comma-separated list of 
hostname exclusion patterns: 

```plain
*.example.com,*.something.com
```

## Configuration

{{% config p="proxy" %}}
```yaml
proxy:
  # Proxy mode (defaults to AUTO)
  mode: (AUTO|DISABLED)
  # URL for HTTP protocol
  httpProxy: (String)
  # URL for HTTPS protocol
  httpsProxy: (String)
  # List of hostname patterns for proxy exclusion 
  noProxy: (List<String>)
```
{{% /config %}}

The `httpProxy`, `httpsProxy` and `noProxy` configuration options have the same syntax as their environment variable
counterparts and will override them if both are present.

Proxy mode takes two useful values:

* `AUTO` which will configure the proxy when environment variables or configuration options are present.
* `DISABLED` which will skip proxy configuration, allowing to customize proxy configuration manually if needed.

## Logs

SeedStack will display the effective proxy configuration in the logs at application startup.