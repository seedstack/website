---
title: "Web security"
type: "home"
zones:
    - "Docs"
tags:
    - web
    - security
menu:
    docs:
        weight: 6
        parent: "web"
---

In a Web application, security can be enforced at the HTTP-level by a servlet filter using URL filtering patterns. 
This feature requires the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-web-security" >}}

The security servlet filter is automatically added on `/*` and has the ability to intercept all application URLs.

## URL patterns

You can configure URL patterns to intercept in configuration:

{{% config p="security.web.urls" %}}
```yaml
security:
  web:
      # List of secured URL patterns
      urls:
        -
          pattern: /some/path/specific
          filters: [ filter1, filter2 ]
        -
          pattern: /some/path/**
          filters: [ filter3, filter4, filter5 ]
        -
          pattern: /other/path/*
          filters: [ filter6 ]
        -
          pattern: /**
          filters: fallbackFilter
```
{{% /config %}}  
    
The URL patterns are [Ant-style path expressions](https://ant.apache.org/manual/dirtasks.html#patterns) relative to your 
Web application's context root.

{{% callout warning %}}
Order is important as the first pattern to match the incoming request is applied and subsequent patterns are ignored. 
This behavior allows to define a catch-all default pattern at the end that will apply if no above filters matched. 
{{% /callout %}}

## Filters 

When a pattern is matched, the filters relative to this pattern are applied in sequence.

### Built-in filters

Various built-in filters are directly available by specifying their names (and eventual parameters) in the filter chain:

* `anon`: immediately allows access to the path without performing security checks of any kind (unless you add other 
filters after it in the chain).
* `authc`: authenticates the subject using the request params (`username` and `password`). This can be used for form 
authentication.
* `authcBasic`: triggers and checks a basic authentication.
* `cert`: extracts the certificates found by the JEE server and provides them to a `X509CertificateRealm`. You can specify 
the `optional` parameter to allow the request even if certificate authentication fails: `cert[optional]`.
* `logout`: logs out the current subject. Note that it will clear the subject session and will invalidate the corresponding 
security caches. Note that basic authentication credentials are kept by user-agents (like browsers), meaning that 
authentication will automatically happen again during the next request.
* `noSessionCreation`: will prevent the creation of a security session.
* `perms`: checks for the permission specified as a parameter. Only allows access if the current subject has the
specified permission. Multiple permissions can be specified with commas: `perms[users:delete, cache:invalidate]` for 
instance.
* `port`: requires the request to be on the specified port: `port[8080]` for instance.
* `rest`: similar to the `perms` filter but appends a CRUD verb derived from the HTTP method to the specified permission(s). 
For instance, `rest[users]` will check the following permissions depending on the HTTP verb:
    * DELETE checks for the `users:delete` permission,
    * GET checks for the `users:read` permission,
    * HEAD checks for the `users:read` permission,
    * OPTIONS checks for the `users:read` permission,
    * POST checks for the `users:create` permission,
    * PUT checks for the `users:update` permission,
    * TRACE checks for the `users:read` permission.
*  `roles`: checks that the subject has the specified role(s). Only allows access if current subject has **all** the 
specified roles. Multiple roles can be specified with commas: `roles[manager, admin]` for instance.
*  `ssl`: Only allows access if the request is on port 443 and `ServletRequest.isSecure()` returns true.
*  `user`: Only allows access if the user is identified.

### Custom filters

You can define you own custom security filters by
 
1. Creating a class implementing {{< java "javax.servlet.Filter" >}} 
2. Annotating it with {{< java "org.seedstack.seed.web.SecurityFilter" "@" >}}. The annotation value will define 
the name of the filter that can be used in filter chains. 

Consider a filter that always returns HTTP response code 418:

```java
@SecurityFilter("teapot")
public class TeapotFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // nothing to do
    }

    @Override
    public void doFilter(ServletRequest request, 
                         ServletResponse response, 
                         FilterChain chain) throws IOException, ServletException {
        ((HttpServletResponse)response).sendError(418);
    }

    @Override
    public void destroy() {
        // nothing to do
    }
}
```

You can use this filter like this:

```yaml
security:
  web:
      urls:
        -
          pattern: /teapot
          filters: teapot
```

When a subject access the `/teapot` URL, an HTTP response code 418 will be returned. To create advanced security filters, 
you can extend existing Shiro security filters, or use them as models.

## Example

Consider the following configuration:

```yaml
security:
  web:
      urls:
        -
          pattern: /static/**
          filters: anon
        -
          pattern: /api/users
          filters: [ ssl, authcBasic, 'rest[users]' ]
        -
          pattern: /api/**
          filters: [ authcBasic, 'roles[normal]' ]
        -
          pattern: /**
          filters: authcBasic
```

This gives the following HTTP security policy:

* Anything served under `/static` can be accessed anonymously.
* The `/api/users` resource can only be accessed by authenticated subjects in HTTPS with the `users:<action>` permission, 
where `<action>` is dependent upon the HTTP method used (see the `rest` filter above for details).
* Anything else served under `/api` can only be accessed by authenticated subjects with the `basic` application-role.
* All others URLs can only be accessed by authenticated subjects.
* In this example, authentication is handled with the Basic Authentication scheme.
