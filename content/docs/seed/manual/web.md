---
title: "Web"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
tags:
    - "servlet"
    - "security"
    - "url"
    - "filter"
    - "static"
    - "resource"
    - "mime"
    - "cors"
    - "websocket"
menu:
    SeedManual:
        weight: 40
---

Seed has great support for Web applications whether by using its lightweight embedded Web server or in more classical
environments, when using an external Web application server. Seed provides tight integration with the Java Servlet 
specification along with support for HTTP security, WebSockets, Cross-Origin Resource Sharing (CORS), or advanced 
static-resources serving.<!--more--> To enable Web support in your project, add the `seed-web-core` module to your classpath.

{{< dependency g="org.seedstack.seed" a="seed-web-core" >}}

{{% callout info %}}
When deploying a Seed application in a standalone Web container, the required minimum Servlet compliance level is 2.5 
though some features require a Servlet 3.0 compliance level. The presence of a `web.xml` file is only required for servlet 2.5.

All the features are available with the embedded Web server.
{{% /callout %}}

# Security

When running in a Servlet environment (Web), you might want to secure access to the application URLs by specifying 
filtering patterns. To enable this feature, add the `seed-web-security` module to your project.

{{< dependency g="org.seedstack.seed" a="seed-web-security" >}}

This module depends upon the `seed-security-core` module. A servlet filter is automatically added on `/*` and, as such, 
has the ability to intercept all application URLs. You can then define its interception behavior by specifying a list or 
URL patterns with their associated chains of security filters.

## URL patterns

Declaring URL patterns for security interception is done in configuration, by prefixing patterns with 
`org.seedstack.seed.security.urls`. This can be easily done in a Props file by defining a section:

    [org.seedstack.seed.security.urls]
    /some/path/specific = filter1, filter2
    /some/path/** = filter3, filter4, filter5
    /other/path/* = filter6
    /** = fallbackFilter
    
The patterns (at the left of the equal sign) are [Ant-style path expressions](https://ant.apache.org/manual/dirtasks.html#patterns)
relative to your Web application's context root. The order matters as the first pattern to match the incoming request is 
applied and subsequent patterns are ignored. This allows to define a catch-all default pattern at the end that will apply 
if no above filters matched. When a pattern is matched, the filters (at the right of the equal sign) are applied in sequence.

## Filters 

Filters can be used for various task such as:

* Authentication (form, basic), 
* Authorization (verify some permission, role), 
* Other security checks or tasks.
 
You can directly use built-in filters or define custom ones.

### Built-in filters

Various built-in filters are directly available by specifying their names (and eventual parameters) in the filter chain:

* `anon`: immediately allows access to the path without performing security checks of any kind (unless you add other 
filters after it in the chain).
* `authc`: authentifies the subject using the request params (`username` and `password`). This can be used for form 
authentication.
* `authcBasic`: triggers and checks a Basic authentication.
* `cert`: extracts the certificates found by the JEE server and provides them to a `X509CertificateRealm`. You can specify 
the `optional` parameter to allow the request even if certificate authentication fails: `cert[optional]`.
* `logout`: logouts the current Subject. Note that it will clear the subject session and will invalidate the corresponding 
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

You can define you own custom security filters by creating a class implementing {{< java "javax.servlet.Filter" >}} and 
annotating it with {{< java "org.seedstack.seed.web.security.SecurityFilter" "@" >}}. The annotation value will define 
the name of the filter that can be used in filter chains. 

As an example, consider a filter that always returns HTTP response code 418:

	@SecurityFilter("teapot")
	public class TeapotFilter implements Filter {

		@Override
		public void init(FilterConfig filterConfig) throws ServletException {
		}

		@Override
		public void doFilter(ServletRequest request, 
		                     ServletResponse response, 
		                     FilterChain chain) throws IOException, ServletException {
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

When a subject access the `/teapot` URL, an HTTP response code 418 will be returned. To create advanced security filters, 
you can extend existing Shiro security filters, or use them as models.

## Example

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
* The `/rest/users` resource can only be accessed by authenticated subjects in HTTPS with the `users:action` permission, 
where action is dependent upon the HTTP method used (see the `rest` filter definition for details).
* Anything served under `/rest/**` can only be accessed by authenticated subjects with the `normal` application-role.
* All others URLs can only be accessed by authenticated subjects.
* In this example, authentication is handled with the Basic Authentication scheme.

# Servlets and Filters

You can register a servlet and its mappings automatically by annotating your servlet class with {{< java "javax.servlet.annotation.WebServlet" >}}:

    @WebServlet("/myservlet/*")
    public class MyServlet extends HttpServlet {
        ...
    }

Similarly, you can register a filter and its mappings automatically by annotating your servlet class with {{< java "javax.servlet.annotation.WebFilter" >}}:

    @WebFilter("/myfilter/*")
    public class MyFilter implements Filter {
        ...
    }

# Static resources

Seed provides automatic static resource serving from the classpath and the document root with some benefits over the container 
default resource serving:

* Automatic serving of pre-minified and/or pre-gzipped versions of resources,
* On-the-fly gzipping of resources,
* Cache friendly,
* Emulation of servlet 3.0 serving from classpath when not available.

{{% callout info %}}
Static resource serving is enabled by default. It has a low priority
Docroot resources always have precedence over classpath resources. If a file under document root leads to the same resulting
path as in classpath, then the document root file have priority (like robots.txt in above example).
{{% /callout %}}

## Default behavior

The default behavior is to serve resources located under the document root folder and, if not found, under the
`META-INF/resources` classpath location on the `/*` path. For example, consider the following folder tree:

    docroot/
        index.html
        robots.txt
            
    META-INF/
        resources/
            robots.txt
            lib/
                jquery.js
                jquery.min.js
                jquery.min.js.gz
                    
The default behavior is to serve index.html, robots.txt and jquery.js on the following paths:

    /robots.txt
    /index.html
    /lib/jquery.js
    
The jquery.js file will be served as a minified and gzipped version (without the overhead of on-the-fly gzipping since
a pre-gzipped version is already available). 

{{% callout info %}}
Docroot resources always have precedence over classpath resources. If a file under document root leads to the same resulting
path as in classpath, then the document root file have priority (like robots.txt in above example).
{{% /callout %}}

## Configuration

Resources are always served on `/*` with a low priority

The default serving path can be altered. For example:

    org.seedstack.seed.web.resources.path = /my-custom-resource-path

The serving paths then are updated by appending `/my-custom-resource-path` to the document root base path and the
`META-INF/resources` classpath location thus serving from respective following paths:

* `docroot/my-custom-resource-path` for document root based resources
* `META-INF/resources/my-custom-resource-path` for classpath based resources

Note that specifying an empty resource path would mean that resources are served directly under the application context root.
In that case the webapp must be dedicated to serving web resources since it will not be able to register additional
servlets (`/*` will be reserved for web resources).

## Minification and gzip support

The file extension is determined from the requested URL as the characters' sequence after the last dot `.` of the 
hierarchical part. For instance `js` extension would be retrieved from: 

```plain
http://myapplication/resources/lib/jquery.js
```

If minification support is enabled and a file with a `min.` prefixed extension is found, then it is used instead of the 
originally requested file In below example, the last file would be served:
    
```plain
/resources/lib/jquery.js
/resources/lib/jquery.min.js
```

If gzip support is enabled and the browser accepts gzip encoding and a file with a `.gzip` suffixed extension is found, 
then it is used instead of the originally requested file (or instead of the minified file determined in the previous step):

For instance, in below example, the last file would be served:

```plain
/resources/lib/jquery.js
/resources/lib/jquery.min.js
/resources/lib/jquery.js.gzip
```

If no gzipped version has been found but on-the-fly gzip support is enabled, the resource will be gzipped in-memory for 
serving. To control the minification and gzip behavior, use the following properties:

    org.seedstack.seed.web.resources.minification-support = true | false
    org.seedstack.seed.web.resources.gzip-support = true | false
    org.seedstack.seed.web.resources.gzip-on-the-fly = true | false

## MIME types

The following MIME types are automatically derived from extensions:

<table class="table table-striped">
<tr><th>Mime type</th><th>Extensions</th></tr>
<tr><td>text/html</td><td>html htm HTML HTM</td></tr>
<tr><td>text/plain</td><td>txt text TXT TEXT</td></tr>
<tr><td>text/javascript</td><td>js JS</td></tr>
<tr><td>text/css</td><td>css less CSS LESS</td></tr>
<tr><td>image/gif</td><td>gif GIF</td></tr>
<tr><td>image/jpeg</td><td>jpeg jpg jpe JPEG JPG JPE</td></tr>
<tr><td>image/png</td><td>png PNG</td></tr>
<tr><td>image/vnd.microsoft.icon</td><td>ico ICO</td></tr>
<tr><td>application/pdf</td><td>pdf PDF</td></tr>
<tr><td>application/json</td><td>json JSON</td></tr>
<tr><td>application/font-woff</td><td>woff WOFF</td></tr>
<tr><td>application/vnd.ms-fontobject</td><td>eot EOT</td></tr>
<tr><td>font/truetype</td><td>ttf TTF</td></tr>
<tr><td>font/opentype</td><td>otf OTF</td></tr>
</table>

## Caching

Resource information is determined by calls to classloader `getResource()` for classpath locations and by calls to
`File.canRead()` for docroot locations. The number of these calls per resource lookup can increase when:

* Using multiple locations (classpath or docroot based), in which case the lookup logic is invoked for each location.
* Using minification and gzip support, in which case the lookup logic itself is more costly trying to find
  the resource in the following order :   
    * gzipped minified version 
    * gzipped version 
    * minified version 
    * normal version    

A built-in cache is used to improve the lookup performance of resources that were served at least one time. You can
alter the cache properties as follows (below example with default values):

```ini
org.seedstack.seed.web.resources.cache.max-size = 8192
org.seedstack.seed.web.resources.cache.concurrency = 32
org.seedstack.seed.web.resources.cache.initial-size = 2048
```

If you don't specify the initial-size configuration property, it will be set at `max-size / 4`.

# CORS

Cross-Origin Resource Sharing (CORS) is supported through a Java filter and can be enabled in any Seed application.

{{% callout info %}}
Seed integrates the CORS filter from [dzhuvinov software](http://software.dzhuvinov.com/cors-filter.html). There is no 
need to install and configure the filter manually, it is automatically registered by Seed. All filter options can be 
specified through configuration properties.
{{% /callout %}}

## Configuration

To enable CORS support just add the following configuration to your application:

```ini
org.seedstack.seed.web.cors.enabled = true
```

## Filter properties

The CORS filter allows to alter its default behavior with various parameters. The filter documentation enumerates all
configuration parameters. Seed can transform any configuration property prefixed with `org.seedstack.seed.web.cors.property`
to the corresponding filter parameter. For instance, to specify the recognized verbs, you can use the following configuration:

```ini
[org.seedstack.seed.web.cors.property]
supportedMethods= GET\\, POST\\, HEAD\\, OPTIONS\\, PUT\\, DELETE
```

This configuration property is automatically translated to the `cors.supportedMethods` filter parameter found in the
documentation. Note that the escaping of the commas is required to inhibit Seed from parsing this value as a list.

{{% callout info %}}
Please refer to this page of the [filter documentation](http://software.dzhuvinov.com/cors-filter-configuration.html)
for a complete list of configuration parameters.
{{% /callout %}}

# WebSockets

Seed also integrates the Java API for WebSocket (JSR 356), allowing server and client endpoints to be injected. WebSocket
support requires Java 7 and a compatible server to work.

## Server endpoints

No specific configuration is required for server endpoint. Just declare a standard JSR 356 endpoint:

    @ServerEndpoint(value = "/chat")
    public class ChatEndpoint {
    
        @Logging
        private Logger logger;
    
        @Inject
        EchoService echoService;
    
        @OnOpen
        public void onOpen(Session session) {
            logger.info("Connected ... " + session.getId());
        }
    
        @OnMessage
        public void message(String message, 
                            Session client) throws IOException, EncodeException {
            for (Session peer : client.getOpenSessions()) {
                peer.getBasicRemote().sendText(echoService.echo(message));
            }
        }
    
        @OnClose
        public void onClose(Session session, CloseReason closeReason) {
            logger.info(String.format("Session %s close because of %s", 
                session.getId(), closeReason));
        }
    
        @OnError
        public void onError(Session session, Throwable t) {
            logger.error(t.getMessage, t);
        }
        
    }

In this example, the endpoint receives a message and then broadcast it to all clients.

## Client endpoints

Unlike server endpoints, client endpoints have to explicitly specify a `SeedClientEndpointConfigurator` in order to be 
managed by Seed.

    @ClientEndpoint(configurator = SeedClientEndpointConfigurator.class)
    public class ChatClientEndpoint1 {
        public static final String TEXT = "Client1 joins";
        public static CountDownLatch latch;
        public static String response;
    
        @OnOpen
        public void onOpen(Session session) {
            try {
                session.getBasicRemote().sendText(TEXT);
            } catch (IOException ioe) {
                ioe.printStackTrace();
            }
        }
    
        @OnMessage
        public void processMessage(String message) {
            response = message;
            latch.countDown();
        }
    }

## Testing

You can test WebSocket endpoints with [Seed Web integration testing]({{< ref "docs/seed/manual/testing.md" >}}). Here is an example which tests two 
client endpoints:

    public class WebSocketIT extends AbstractSeedWebIT {
    
        @Logging
        private Logger logger;
    
        @Inject
        ChatClientEndpoint1 chatClientEndpoint1;
    
        @Inject
        ChatClientEndpoint2 chatClientEndpoint2;
    
        @Deployment
        public static WebArchive createDeployment() {
            return ShrinkWrap.create(WebArchive.class);
        }
    
        @Test
        @RunAsClient
        public void communication_is_working(@ArquillianResource URL baseUrl) throws Exception {
            ChatClientEndpoint1.latch = new CountDownLatch(1);
    
            final Session session1 = connectToServer(baseUrl, chatClientEndpoint1);
            assertNotNull(session1);
    
            assertTrue(ChatClientEndpoint1.latch.await(2, TimeUnit.SECONDS));
            assertEquals("echo: " + ChatClientEndpoint1.TEXT, ChatClientEndpoint1.response);
    
            ChatClientEndpoint1.latch = new CountDownLatch(1);
            ChatClientEndpoint2.latch = new CountDownLatch(1);
    
            final Session session2 = connectToServer(baseUrl, chatClientEndpoint2);
            assertNotNull(session2);
    
            assertTrue(ChatClientEndpoint1.latch.await(2, TimeUnit.SECONDS));
            assertTrue(ChatClientEndpoint2.latch.await(2, TimeUnit.SECONDS));
            assertEquals("echo: " + ChatClientEndpoint2.TEXT, ChatClientEndpoint1.response);
            assertEquals("echo: " + ChatClientEndpoint2.TEXT, ChatClientEndpoint2.response);
        }
    
        private Session connectToServer(URL baseUrl, Object endpoint) {
            try {
            WebSocketContainer container = ContainerProvider.getWebSocketContainer();
            URI uri = new URI("ws://" + baseUrl.getHost() + ":" + baseUrl.getPort()
                + baseUrl.getPath() + "chat");
            return container.connectToServer(endpoint, uri);
            } catch(Exception e) {
                logger.error(e.getMessage(), e);
                fail();
            }
        }
        
    }
