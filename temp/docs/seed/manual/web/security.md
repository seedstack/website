---
title: "Web security"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedWeb"
tags:
    - "web"
    - "security"
    - "filter"
    - "maven"
    - "configuration"
menu:
    SeedWeb:
        weight: 40
---

When running in a Servlet environment (Web), you might want to secure access to the application URLs by specifying filtering patterns. To enable this feature, add the Web support security module in your classpath:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-web-support-security</artifactId>
    </dependency>

{{% callout info %}}
A servlet filter is automatically added on `/*` and, as such, has the ability to intercept all application URLs.  You can then define its interception behavior by specifying a list or URL patterns with their associated chains of security filters.
{{% /callout %}}

# URL patterns

Declaring URL patterns for interception is done by prefixing patterns `org.seedstack.seed.security.urls`. This can be easily done by defining a corresponding section:

    [org.seedstack.seed.security.urls]
    /some/path/specific = filter1, filter2
    /some/path/** = filter3, filter4, filter5
    /other/path/* = filter6
    /** = fallbackFilter
    
The patterns (at the left of the equal sign) are Ant-style path expressions relative to your Web application's context root. The order matters as the first pattern to match the incoming request is applied and subsequent patterns are ignored. This allows to define a catch-all default pattern at the end that will apply if no above filters matched. When a pattern is matched, the filters (at the right of the equal sign) are applied in sequence.

# Filters 

Filters can be used for various task such as:

* Authentication (form, basic), 
* Authorization (verify some permission, role), 
* Other security checks or tasks.
 
You can directly use built-in filters or define custom ones.

## Built-in filters

Various built-in filters are directly available by specifying their names (and eventual parameters) in the filter chain:

- `anon`: immediately allows access to the path without performing security checks of any kind (unless you add other filters after it in the chain).
- `authc`: authentifies the subject using the request params (`username` and `password`). This can be used for form authentication.
- `authcBasic`: triggers and checks a Basic authentication.
- `cert`: extracts the certificates found by the JEE server and provides them to a `X509CertificateRealm`. You can specify the `optional` parameter to allow the request even if certificate authentication fails: `cert[optional]`.
- `logout`: logouts the current Subject. Note that it will clear the subject session and will invalidate the corresponding security caches. Note that basic authentication credentials are kept by user-agents (like browsers), meaning that authentication will automatically happen again during the next request.
- `noSessionCreation`: will prevent the creation of a security session.
- `perms`: checks for the permission specified as a parameter. Only allows access if the current subject has the specified permission. Multiple permissions can be specified with commas: `perms[users:delete, cache:invalidate]` for instance.
- `port`: requires the request to be on the specified port: `port[8080]` for instance.
- `rest`: similar to the `perms` filter but appends a CRUD verb derived from the HTTP method to the specified permission(s). For instance, `rest[users]` will check the following permissions depending on the HTTP verb:
    - DELETE checks for the `users:delete` permission,
    - GET checks for the `users:read` permission,
    - HEAD checks for the `users:read` permission,
    - OPTIONS checks for the `users:read` permission,
    - POST checks for the `users:create` permission,
    - PUT checks for the `users:update` permission,
    - TRACE checks for the `users:read` permission.
-  `roles`: checks that the subject has the specified role(s). Only allows access if current subject has **all** the specified roles. Multiple roles can be specified with commas: `roles[manager, admin]` for instance.
-  `ssl`: Only allows access if the request is on port 443 and `ServletRequest.isSecure()` returns true.
-  `user`: Only allows access if the user is identified.

## Custom filters

You can define you own custom security filters by creating a class implementing `javax.servlet.Filter` and annotating it with `@SecurityFilter`. The annotation value will define the name of the filter that can be used in filter chains. As an example, consider a filter that always returns HTTP response code 418 (I'm a teapot !):

	@SecurityFilter("teapot")
	public class TeapotFilter implements Filter {

		@Override
		public void init(FilterConfig filterConfig) throws ServletException {
		}

		@Override
		public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
			((HttpServletResponse)response).sendError(418);
		}

		@Override
		public void destroy() {
		}

	}

You can use it in filter chains like this:

```ini
[org.seedstack.seed.security.urls]
/teapot = teapot
```

When a subject access the `/teapot` URL, an HTTP response code 418 will be returned. To create advanced security filters, you can extend existing Shiro security filters, or use them as models.

# Example

Consider the following example:

```ini
[org.seedstack.seed.security.urls]
/resources/** = anon
/rest/users = ssl, authcBasic, rest[users]
/rest/** = authcBasic, roles[normal]
/** = authcBasic
```

Note that:

* Anything served under `/resource/**` can be accessed anonymously.
* The `/rest/users` resource can only be accessed by authenticated subjects in HTTPS with the `users:action` permission, where action is dependent upon the HTTP method used (see the `rest` filter definition for details).
* Anything served under `/rest/**` can only be accessed by authenticated subjects with the `normal` application-role.
* All others URLs can only be accessed by authenticated subjects.
* In this example, authentication is handled with the Basic Authentication scheme.
