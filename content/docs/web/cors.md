---
title: "CORS"
type: "home"
zones:
    - "Docs"
sections:
    - "Manual"    
tags:
    - web
    - interfaces
menu:
    docs-manual:
        weight: 4
        parent: "web"

---

Cross-Origin Resource Sharing (CORS) is supported through a Java filter and can be enabled in any SeedStack application.

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
      
      # Allows to specify custom properties to the CORS filter (see below)
      properties: 
        key: (String)
```
{{% /config %}}

### Properties

This is a description of the CORS Filter configuration properties.

-   **`allowGenericHttpRequests`** `{true|false}` defaults to `true`.\
    If `true` generic HTTP requests will be allowed to pass through the filter, else only valid and accepted CORS requests will be allowed (strict CORS filtering).
    
-   **`allowOrigin`** `{"*"|origin-list}` defaults to `*`.\
    Whitespace-separated list of origins that the CORS filter must allow. Requests from origins not included here will be refused with an [HTTP 403](http://en.wikipedia.org/wiki/HTTP_403) "Forbidden" response. If set to `*` (asterisk) any origin will be allowed.

Example: Allow any origin:

    *

Example: Allow cross-domain requests from following three origins only:

    http://example.com 
    http://example.com:8080 
    https://secure.net

-   **`allowSubdomains`** `{true|false}` defaults to `false`.\
    If `true` the CORS filter will allow requests from any origin which is a subdomain origin of the [allowed origins](http://software.dzhuvinov.com/cors-filter-configuration.html#cors.allowOrigin). A subdomain is matched by comparing its scheme and suffix (host name / IP address and optional port number).

Example: If the explicitly allowed origin is `http://example.com` and subdomains are allowed, all of the following origins will be allowed too:

    http://www.example.com
    http://foo.example.com
    http://bar.example.com

These non-matching origins, however, will be denied:

    http://www.example.com:8080
    https://foo.example.com
    http://myexample.com

-   **`supportedMethods`** `{method-list}` defaults to `"GET, POST, HEAD, OPTIONS"`.\
    List of the supported HTTP methods. These are advertised through the [Access-Control-Allow-Methods](http://www.w3.org/TR/cors/#access-control-allow-methods-response-he) header and must also be implemented by the actual CORS web service. Requests for methods not included here will be refused by the CORS filter with an [HTTP 405](http://en.wikipedia.org/wiki/HTTP_405#4xx_Client_Error) "Method not allowed" response.

Example: Allow only GET cross-origin requests:

    GET

Example: Allow the methods for a typical [RESTful](http://en.wikipedia.org/wiki/Representational_State_Transfer) web service:

    GET, POST, HEAD, PUT, DELETE

-   **`supportedHeaders`** `{"*"|header-list}` defaults to `*`.\
    The names of the supported author request headers. These are advertised through the [Access-Control-Allow-Headers](http://www.w3.org/TR/cors/#access-control-allow-headers-response-he) header.

    If the configuration property value is set to `*` (asterisk) any author request header will be allowed. The CORS Filter implements this by simply echoing the requested value back to the browser.

    What is an *author request header*? This any custom header set by the browser JavaScript application through the [XMLHttpRequest.setRequestHeader()](http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method) method.

Example: Inform the browser that the following author request headers are supported:

    Content-Type, X-Requested-With

-   **`exposedHeaders`** `{header-list}` defaults to empty list.\
    List of the response headers other than [simple response headers](http://www.w3.org/TR/cors/#simple-response-header) that the browser should expose to the author of the cross-domain request through the [XMLHttpRequest.getResponseHeader()](http://www.w3.org/TR/XMLHttpRequest/#the-getresponseheader-method) method. The CORS filter supplies this information through the [Access-Control-Expose-Headers](http://www.w3.org/TR/cors/#access-control-expose-headers-response-h) header.

Example: Inform the browser that the following custom headers are safe to be exposed to the script that initiated the cross-domain request:

    X-Custom-1, X-Custom-2

-   **`supportsCredentials`** `{true|false}` defaults to `true`.\
    Indicates whether user credentials, such as cookies, HTTP authentication or client-side certificates, are supported. The CORS filter uses this value in constructing the [Access-Control-Allow-Credentials](http://www.w3.org/TR/cors/#access-control-allow-credentials-respons) header.
    
-   **`maxAge`** `{int}` defaults to `-1` (unspecified).\
    Indicates how long the results of a preflight request can be cached by the web browser, in seconds. If `-1` unspecified. This information is passed to the browser via the [Access-Control-Max-Age](http://www.w3.org/TR/cors/#access-control-max-age-response-header) header.

Example: Suggest the browser should cache preflight requests for 1 hour:

    3600

-   **`tagRequests`** `{true|false}` defaults to `false` (no tagging).\
    Enables HTTP servlet [request tagging](http://software.dzhuvinov.com/cors-filter-tagging.html) to provide CORS information to downstream handlers (filters and/or servlets).

Example: Enable request tagging:

    true

{{% callout ref %}}
The full documentation of CORS properties can be found [here](http://software.dzhuvinov.com/cors-filter-configuration.html#section-1).
The `cors.` prefix must be ignored in the SeedStack configuration (e.g. `cors.tagRequests` becomes `tagRequests`).
{{% /callout %}}

