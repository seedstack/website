---
title: "REST"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
tags:
    - "jax-rs"
    - "resource"
    - "http"
    - "hypermedia"
    - "api"
    - "link"
    - "json"
menu:
    SeedManual:
        weight: 60
---

Seed provides support for [Representational State Transfer][1] (REST) architectural style through the **JAX-RS** 
specification. Implementation rely on [Jersey](https://jersey.java.net/). To enable REST support in your project, add 
the `seed-rest-jersey2` module. 

{{< dependency g="org.seedstack.seed" a="seed-rest-jersey2" >}}

{{% callout info %}}
A `seed-rest-jersey1` module is also provided when JAX-RS 2.0 cannot be used in your environment.
{{% /callout %}}

# JAX-RS 101

Within JAX-RS context, resources are classes annotated with `@Path`. All these classes are automatically detected and registered 
by Seed. This means that you can inject any other classes managed by Seed in your resources. A new instance of the resource 
class is created for each request.

{{% callout info %}}
REST resources are exposed on `/` by default and have priority when their path conflict with a static resource. The default prefix can be changed by specifying the `org.seedstack.seed.rest.path` configuration property.
{{% /callout %}}

Below is an example of a simple "Hello World" REST resource:

    @Path("/hello")
    public class HelloResource {

        @GET
        @Produces("text/plain")
        @Path("/{msg}")
        public String sayHello(@PathParam("msg") String message) {
            return Response.ok("Hello " + message).build();
        }

    }

This resource is exposed by default on `/hello`. You can request the resource with:

    curl 'http://localhost:8080/hello/world'

The returned response body will be:

```plain
Hello world
```

## Requests

An HTTP request is mapped to resource method according to its: path, verb and content-type. If no resource method matches 
an HTTP request, the HTTP status 405 (Method not allowed) is returned.

### Path

The path is determined by the annotation `@Path`. This annotation is **mandatory** on the class and can be also added 
on the method to express the notion of sub-resources. The annotation [value][1] is the relative URI path but can also 
contain a URI template or a regex expression.

### Verb

HTTP verb is determined by a corresponding annotation. Each verb has its own annotation: `@GET`, `@POST`, `@PUT`, etc.

### Content-type

The content type is determined with `@Produces(MediaType.APPLICATION_JSON)` and `@Consumes(MediaType.APPLICATION_JSON)`

## Responses

JAX-RS allows to return a detailed response, with the resource representation and an HTTP status code. For instance the 
following resource will return HTTP status code 201 (Created) with the URI of the created resource.

    @POST
    public Response createPerson(PersonRepresentation pr, @Context UriInfo uriInfo) {
        PersonRepresentation createdPerson = accountService.register(pr);
        
        URI newUri = new URI(
            uriInfo.getRequestUri().toString() + 
            "/" +  
            createdPerson.getId()
        );
            
        return Response.created(newUri).entity(createdPerson).build();
    }

## Exception handling

Exception handling is an important part of any API design. Carefully designed error handling will allow you to provide 
meaningful status codes and messages to the client instead of dumping raw stacktraces in your HTTP response.

### Web application exceptions

One way to implement clean exception handling in your REST API is to extend the {{< java "javax.ws.rs.WebApplicationException" >}}
class:

    public class NotFoundException extends WebApplicationException {
    
        public NotFoundException(String msg) {
            super(Response.status(Response.Status.NOT_FOUND).entity(msg).build());
        }
        
    }

If the exception is thrown from within a resource method, the server will return an HTTP status code `404`. 
 
### Exception mappers
 
Another way of implementing exception handling is to map existing exceptions to `Response` using an `ExceptionMapper`: 

    @Provider
    public class MyBusinessExceptionMapper implements ExceptionMapper<MyBusinessException> {
    
        @Override
        public Response toResponse(MyBusinessException exception) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity(exception.getMessage())
                    .build();
        }
        
    }

If the a `MyBusinessException` exception class is thrown from within a resource method, the server will return an HTTP 
status code `400`.

# Testing

Testing REST resources can be done in a real Web environment by using [Seed Web integration testing](../testing#web-integration-tests).
Consider this example:

    public class ProductsResourceIT extends AbstractSeedWebIT {

        @ArquillianResource
        private URL baseURL;

        @Deployment
        public static WebArchive createDeployment() {
            return ShrinkWrap.create(WebArchive.class);
        }
    
        @RunAsClient
        @Test
        public void testCreate() throws JSONException {
            JSONObject obj = new JSONObject();
            obj.put("summary", "The world's highest resolution notebook");
            obj.put("categoryId", 1);
            obj.put("designation", "macbook pro");
            obj.put("picture", "mypictureurl");
            obj.put("price", 200.0);

            String response = expect().statusCode(201).given()
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .body(obj.toString())
                    .post(baseURL.toString() + "rest/products/")
                    .asString();

            JSONAssert.assertEquals(obj, new JSONObject(response), false);
        }
        
    }

This example uses two libraries for easy REST testing:

* [REST Assured](https://github.com/jayway/rest-assured) which can test various HTTP request/response scenarios.
* [JSONassert](https://github.com/skyscreamer/JSONassert) which can assert conditions on JSON documents.

# Working with streams

## Send a stream

To send bytes (like images) JAX-RS can return special stream:

     @GET
     @Produces("text/plain")
     public StreamingOutput  hello() {
         return new StreamingOutput() {
             @Override
             public void write(OutputStream output) throws IOException, WebApplicationException {
                 output.write("Hello World".getBytes());
             }
        };
     }

## Receive a stream

To read a data stream (file, image or bytes) JAX-RS can inject a Reader or an InputStream :

    @Path("/files")
    public class FileResource {

        @POST
        @Path("/upload")
        @Consumes("application/pdf")
        public void doSomething(InputStream is) {
            readFileWithInputStream(is);
        }

        @POST
        @Path("/upload-image")
        public void doSomethingWithReader(@FormDataParam("file") Reader reader) {
            readFileWithReader(reader);
        }

    }

# Custom formats

Seed REST support works out-of-the-box with XML and JSON formats. If your project requires a custom format, you can implement
your own readers and/or writers:

* Create a class which implements {{< java "javax.ws.rs.ext.MessageBodyWriter" >}} and/or {{< java "javax.ws.rs.ext.MessageBodyReader" >}}
with the custom format specified as the generic type.
* Add the {{< java "javax.ws.rs.ext.Provider" "@" >}} annotation.
* Add the {{< java "javax.ws.rs.Produces" "@" >}} if this is a writer.`@Produces` and `@Consumes` if relevant.
* Add the {{< java "javax.ws.rs.Consumes" "@" >}} if this is a reader.
* Implement the necessary methods.

More documentation is available in the [JAX-RS Javadoc](http://docs.oracle.com/javaee/6/api/javax/ws/rs/ext/package-summary.html).

# RESTful API design

The [Representational State Transfer][1] (REST) architectural style was defined in 2000 by Roy Fielding. This architectural 
style defines a set of constraints based on the Web architecture. These constraints are the following:

1. Client-Server
2. Stateless
3. Cache
4. Uniform interface
5. Layered System
6. Code-On-Demand

In this section, we will focus on the fourth constraint and how to implement it in a Seed application.

## Uniform interface

> REST is defined by four interface constraints: identification of
> resources; manipulation of resources through representations;
> self-descriptive messages; and, hypermedia as the engine of
> application state. Roy T. Fielding.

### Identification of resources

The identification of resources means that each resource should be accessible through an URI. For instance a book `123` 
will be accessible though the `/books/123` URI.

### Manipulation of resources through representations

Resources should be manipulated through representation. This means that you **should not** expose your resource (like a 
business object) directly because it will make refactoring impossible without breaking the clients.

### Self-descriptive messages

The messages should be context-free to respect the stateless constraint. Each message should embedded self-descripting
messaging. For this, the HTTP 1.1 specification defines a list of [HTTP verbs][7], [status codes][6], and [headers][2] to 
exchange metadata. For instance the following JAX-RS method specify that the HTTP verb is `POST`, it accepts the media 
type `application/json` and return `201` (Created).

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createPerson(PersonRepresentation pr, @Context UriInfo uriInfo) {
        PersonRepresentation createdPerson = accountService.register(pr);
        
        URI newUri = new URI(
            uriInfo.getRequestUri().toString() + 
            "/" + 
            createdPerson.getId()
        );
            
        return Response.created(newUri).entity(createdPerson).build();
    }

### Hypermedia as the engine of application state (HATEOAS)

According to Roy T. Fielding, a REST API is a set of resources that can be explored by following links. Each resource is 
a representation of a state of the application and the links are the transitions between those states. 

> The name "Representational State Transfer" is intended to evoke an
> image of how a well-designed Web application behaves: a network of
> web pages (a virtual state-machine), where the user progresses
> through the application by selecting links (state transitions),
> resulting in the next page (representing the next state of the
> application) being transferred to the user and rendered for their
> use. Roy T. Fielding.

Such a Web application has the following advantages:

* The state of the application controlled by the server as it tells the client what it can do next.
* It allows the refactoring of server's URI scheme without breaking clients.
* It helps client developers to explore the API.
* It allows the server developers to advertise deprecation or new capabilities by adding hints on existing links or by 
adding new links.

The benefits of an hypermedia API are obvious but it is often seen as difficult to implement in real-life applications.


With Seed, we want to make it so easy that all Seed REST application will support hypermedia by default. In order to do 
this, Seed supports two dedicated media types. They are both based on JSON and describe conventions to link to other 
resources.


## JSON-HOME

To ease REST API discovery, Seed exposes an API home resource with the [JSON-HOME][3] media type. This is similar to a Website
homepage but for REST APIs.

The goal of the JSON-HOME media type is to expose an home resource which provides all the entry points of the application's 
API. It tells the client developer what it can do and give him hints on how to use the resources.

The following example shows a JSON-HOME resource with two entry points "widgets" and "widget". For the "widgets" resource, 
the JSON-HOME provides just an href indicating the URI of the resource. But for the "widget" resource, the JSON-HOME provides
an href-template instead. 

```json
GET / HTTP/1.1
Host: example.org
Accept: application/json-home

HTTP/1.1 200 OK
Content-Type: application/json-home
Cache-Control: max-age=3600
Connection: close

{
  "resources": {
    "http://example.org/rel/widgets": {
      "href": "/widgets/"
    },
    "http://example.org/rel/widget": {
      "href-template": "/widgets/{widget_id}",
      "href-vars": {
        "widget_id": "http://example.org/param/widget"
      },
      "hints": {
        "allow": ["GET", "PUT", "DELETE", "PATCH"],
        "formats": {
          "application/json": {}
        },
        "accept-patch": ["application/json-patch"],
        "accept-post": ["application/xml"],
        "accept-ranges": ["bytes"]
      }
    }
  }
}
```

To expose a JAX-RS resource in the JSON-HOME resource, annotate the resource with `@Rel` and set the home attribute to 
`true`. The annotation can be on the class or the method.

    @Rel(value = CatalogRels.PRODUCT, home = true) // Add it to JSON-HOME
    @Path("/products/{title}")
    @Produces({MediaType.APPLICATION_JSON, "application/hal+json"})
    public class ProductResource {
    
        @GET
        public Response getProduct() {
            ...
        }
        
    }

## Hypertext Application Language (HAL)

Beyond providing an "API homepage", you have to provide a way to navigate between these pages. That's the role of the 
[HAL+JSON][4] media type, which establishes conventions for expressing hypermedia controls. An HAL representation 
looks like this:

```json
GET /orders HTTP/1.1
Host: example.org
Accept: application/hal+json

HTTP/1.1 200 OK
Content-Type: application/hal+json

{
  "_links": {
    "self": { "href": "/orders" },
    "next": { "href": "/orders?page=2" },
    "find": { "href": "/orders{?id}", "templated": true }
  },
  "_embedded": {
    "orders": [{
        "_links": {
          "self": { "href": "/orders/123" },
          "basket": { "href": "/baskets/98712" },
          "customer": { "href": "/customers/7809" }
        },
        "total": 30.00,
        "currency": "USD",
        "status": "shipped",
      },{
        "_links": {
          "self": { "href": "/orders/124" },
          "basket": { "href": "/baskets/97213" },
          "customer": { "href": "/customers/12369" }
        },
        "total": 20.00,
        "currency": "USD",
        "status": "processing"
    }]
  },
  "currentlyProcessing": 14,
  "shippedToday": 20
}
```

It is a JSON representation with just two reserved keywords: 

* `_links`: this property is used to share links to other resources. Links are represented as a set of keys and
values. The keys represents a relation type (rel) and the value a link object. The only required value of the link object 
is `href` which can be an URI or an URI template (`/orders{?id}`). By convention, a resource always returns a `self` link 
with its own URI. However, the propery `_links` is optional. For more information on link object see the [section 5][5] of 
the specification.
* `_embedded`: this property is a set of keys and values. Keys are relation types and values can be a resource object or 
an array of resource objects. The embedded resources can be full or partial representations of a resource. 


## Usage

### Building HAL links

Concatenating strings for building hrefs can quickly become painful and error-prone. With Seed, you have access to a 
`RelRegistry` which can greatly simplify the task. This registry contains all the resources annotated by `@Rel` and their 
href. HAL links can have two distinct forms:

* An expanded form, where all variables are sent already resolved to the client,
* A templated form, where the URI template is sent to the client.

Consider the following resource:

    @Path("/products")
    public class ProductsResource {
        
        GET
        Rel(value = "products") // defines the resource rel
        Produces({MediaType.APPLICATION_JSON, "application/hal+json"})
        public Response products(@DefaultValue("0") @QueryParam("pageIndex") Integer pageIndex,
                                @DefaultValue("10") @QueryParam("pageSize") Integer pageSize) {
           ...
        }
    }

The expanded link can be created as follows:

    Link link = relRegistry.uri("products") // points to the resource rel
                             .set("pageIndex", pageIndex)
                             .set("pageSize", pageSize);

This will result in the following JSON sent to the client:

    { 
        "href": "/products?pageIndex=0&pageSize=10" 
    }
    
The templated link can be created as follows:

    Link link = relRegistry.uri("products") // points to the resource rel
                             .set("pageIndex", pageIndex)
                             .set("pageSize", pageSize)
                             .templated();
                             
This will result in the following JSON sent to the client:

    { 
        "href": "/products{?pageIndex,pageSize}", 
        "templated": true 
    }

{{% callout info %}}
Note that seed will automatically use the Servlet context path and the REST prefix to build HAL links, alleviating the need for you
to build any URI manually.
{{% /callout %}}

### Creating HAL representations

Seed provides two options to simplify the creation of HAL representations. First, you can take an existing representation 
and transform it to an HAL representation using the `HALBuilder`:

    @Inject RelRegistry relRegistry;
    
    ...

    HalRepresentation representation = HalBuilder.create(productRepresentation)
                    .self(relRegistry.uri("products").set("id", productId)
                    .link(relRegistry.uri("find").templated())
                    .embedded("related", relatedProducts);

The second option is to make your representation inherit the `HalRepresentation`.

    public class ProductsRepresentation extends HalRepresentation {
        private long totalSize;
        private long currentPage;
    
        ProductsRepresentation() {
        }
    
        public ProductsRepresentation(List<Product> products, int totalSize, int pageIndex) {
            this.totalSize = totalSize;
            this.currentPage = pageIndex;
            embedded("products", products);
        }
    
        public long getTotalSize() {
            return totalSize;
        }
    
        public long getCurrentPage() {
            return currentPage;
        }
    }


[1]: https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
[2]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14
[3]: http://tools.ietf.org/html/draft-nottingham-json-home-03
[4]: https://tools.ietf.org/html/draft-kelly-json-hal-06
[5]: https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5
[6]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
[7]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
