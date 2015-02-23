---
title: "Web security"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedWeb"
menu:
    SeedWeb:
        weight: 40
---

When running in a Servlet environment (Web), you might want to secure the access to the URLs of your application. This
document will describe how to achieve this goal using SEED Web security support. Below is the maven dependency snippet:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-web-support-security</artifactId>
    </dependency>

The SEED security Web filter will automatically be added on `/*`.

# Security filters 

Securing URLs of your application requires security policy to be defined using chains of security filters. These
are not JEE filters but they represent a chain of filters that are applied when a Subject requests an URL. Filters can be used for:

* authentication (form, basic), 
* authorization (verify some permission, role), 
* other security issues

## Existing filters

Here is a list of recognized security filters, as you can write them in the configuration :

- `anon` : allows access to the path immediately without performing security checks of any kind (unless you add a filter to it).
- `authc` : authentifies the user with params in the request (form). Names of params are username and password. This is NOT the PSA standard.
- `authcBasic` : triggers a Basic authentication (Standard PSA authentication).
- `cert` : extract the certificates found by the JEE server to provide them to a X509CertificateRealm. Use parameter *optional* to let filters continue if certificate authentication fails : cert[optional]
- `logout` : logouts the current Subject. Note that it will clean Subject's session and security caches for the user BUT in Basic auth it does not really disconnects a user as the browser automatically resends the authentication.
- `noSessionCreation` : will not create a session. Useful for web services that don't need a session.
- `perms` : allows access only if the current user has the permissions specified. Use perms[lightSaber:wield, academy:teach] for example.
- `port` : requires the request to be on the specified port. Use port[8080] for example.
- `rest` : translates HTTP methods to permissions. For example rest[user] will check the following permissions depending on the HTTP verb.
    - DELETE checks user:delete
    - GET checks user:read
    - HEAD checks user:read
    - OPTIONS checks user:read
    - POST checks user:create
    - PUT checks user:update
    - TRACE checks user:read
-  `roles` : allows access only if user has all the roles descibed. Use roles[jedi, teacher] for example.
-  `ssl` : Access is allowed only if the request is on port 443 and ServletRequest.isSecure().
-  `user` : Access allowed if the user is known.

## Declaring filters

In your configuration props files, add a section *[com.inetpsa.seed.security.urls]*. The key is the URL pattern
to match (ant like), the values are the filters to apply. The first matching pattern will be applied allowing to define default
filters at the end. Here is an example of configuration.

	[com.inetpsa.seed.security.urls]
	*resources/** = anon
	/ = anon
	/index.html = anon
	/jediCouncil.html = authcBasic, perms["lightSaber:wield"]
	/jediAcademy.html = authcBasic, perms["academy:learn"]
	/rest/users/** = authcBasic, rest[user]
	/logout = logout
	/** = authcBasic

# Custom security filters

In order to define a custom security filters in a Web environment, create a class implementing (at least) `javax.servlet.Filter` with `@SecurityFilter`.
The value of the annotation is the name used when declaring the security filter chain. For example, consider a filter that always returns HTTP response code 418 (I'm a teapot !):

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


In the configuration props file:

	[com.inetpsa.seed.security.urls]
	/teapot = teapot

Now if you reach url /teapot on your server, you get an HTTP response code 418. To create more advanced security filters,
you can get inspiration from/extend shiro security filters.