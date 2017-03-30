---
title: "JAX-RS basics"
author: "Emmanuel VINEL"
date: 2017-02-09
tags:
    - REST
    - API
zones:
    - Guides
---

JAX-RS is a specification providing a standard way to write REST resources in Java. SeedStack implements the JAX-RS
standard through the [Jersey 2](https://jersey.java.net/) implementation.<!--more-->

# Working with JAX-RS resources

JAX-RS resources are annotated with at least a {{< java "javax.ws.rs.Path" "@" >}} and an HTTP verb annotation:

```java
@Path("/hello")
public class HelloResource {
    @GET
    @Produces("text/plain")
    @Path("/{msg}")
    public String sayHello(@PathParam("msg") String message) {
        return "Hello " + message;
    }
}
```

This resource is exposed by default on `/hello/{msg}`. The {msg} part is a mandatory path parameter. This resource
produces simple text content (`text/plain` mime-type). You can request the resource with:

```bash
curl 'http://localhost:8080/hello/world'
```

The returned response body is:

```plain
Hello world
```

{{% callout ref %}}
You can find more information about how to declare JAX-RS resources [here](https://jersey.java.net/documentation/latest/jaxrs-resources.html).
{{% /callout %}} 

## Requests

An HTTP request is mapped to resource method according to its: path, verb and content-type. If no resource method matches 
an HTTP request, the HTTP status 405 (method not allowed) is returned.

### Path

The resource path is determined by the {{< java "javax.ws.rs.Path" "@" >}} annotation. This annotation is **mandatory** 
on the class and can be also added on the method to express the notion of sub-resources. The annotation value parameter 
contains the relative URI path which can be an URI template or even a regular expression.

### Verb

HTTP verb is determined by a corresponding annotation. Each verb has its own annotation: {{< java "javax.ws.rs.GET" "@" >}},
{{< java "javax.ws.rs.POST" "@" >}}, {{< java "javax.ws.rs.PUT" "@" >}}, {{< java "javax.ws.rs.DELETE" "@" >}}, etc...

### Content-type

Content-type negotiation and mapping is determined by the {{< java "javax.ws.rs.Produces" "@" >}} and 
{{< java "javax.ws.rs.Consumes" "@" >}} annotations.

## Responses

JAX-RS allows to return a detailed response using the Response builder methods. For instance the following resource 
will return HTTP status code 201 (Created) with the URI of the created resource.

```java
@Path("/products")
public class ProductsResource {
    @Inject
    private CatalogService catalogService;
    
    @GET
    @Path("/{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public ProductRepresentation getProduct(@PathParam("id") long productId) {
        Optional<Product> product = catalogService.findProduct(productId);
        if (!product.isPresent()) {
            throw new NotFoundException("Product " + productId + " cannot be found");
        }
        return new ProductRepresentation(product.get());
    }
    
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response createProduct(ProductRepresentation pr, @Context UriInfo uriInfo) {
        Product newProduct = catalogService.addProduct(
                pr.getDesignation(), 
                pr.getPrice());
        URI newUri = new URI(
                uriInfo.getRequestUri().toString() + 
                "/" + 
                newProduct.getId());
        return Response.created(newUri).entity(newProduct).build();
    }
}
```

# Exception handling

Exception handling is an important part of any API design. Carefully designed error handling will allow you to provide 
meaningful status codes and messages to the client instead of returning a 500 HTTP response every time.

## Web application exceptions

One way to implement clean exception handling in your REST API is to use the {{< java "javax.ws.rs.WebApplicationException" >}}
class, either directly or one of its predefined sub-classes or by extending the class yourself:  
class:

```java
public class ProductNotFoundException extends WebApplicationException {
    public ProductNotFoundException(Product product) {
        super(Response.status(Response.Status.NOT_FOUND).entity(product.getId()).build());
    }
}
```

If the exception is thrown from within a resource method, the server will return an HTTP status code `404`. 
 
## Exception mappers
 
Another way of implementing exception handling is to map existing exceptions to a {{< java "javax.ws.rs.core.Response" >}}
by implementing an {{< java "javax.ws.rs.ext.ExceptionMapper" >}} and annotating it with {{< java "javax.ws.rs.ext.Provider" >}}: 

```java
@Provider
public class MyExceptionMapper implements ExceptionMapper<MyException> {
    @Override
    public Response toResponse(MyException myException) {
        return Response
                .status(Response.Status.BAD_REQUEST)
                .entity(myException.getSomeDetails())
                .build();
    }
}
```

If the a `MyException` exception class is thrown from a JAX-RS resource, the server will return an HTTP status code `400`
with custom details as the returned entity.

# Working with streams

## Sending a stream

To stream raw bytes (like image data) to the client, JAX-RS can return a special object:

```java
public class MyStreamingResource {
    @GET
    @Produces("text/plain")
    public StreamingOutput hello() {
        return new StreamingOutput() {
            @Override
            public void write(OutputStream output) throws IOException, WebApplicationException {
                output.write("Hello World".getBytes());
            }
        };
    }
}
```

## Receiving a stream

To receive a raw bytes stream (like a file upload), JAX-RS can provide a Reader or an InputStream:

```java
@Path("/files")
public class FileResource {
    @POST
    @Path("/upload")
    @Consumes("application/pdf")
    public void doSomethingWithInputStream(InputStream inputStream) {
        doSomeReading(inputStream);
    }

    @POST
    @Path("/upload-image")
    public void doSomethingWithReader(@FormDataParam("file") Reader reader) {
        doSomeReading(reader);
    }
}
```

# Custom formats

SeedStack REST support works out-of-the-box with XML and JSON formats. If you requires a custom format, you can implement
your own readers and/or writers:

* Create a class which implements {{< java "javax.ws.rs.ext.MessageBodyWriter" >}} and/or {{< java "javax.ws.rs.ext.MessageBodyReader" >}}
with the custom format specified as the generic type.
* Add the {{< java "javax.ws.rs.ext.Provider" "@" >}} annotation.
* Add the {{< java "javax.ws.rs.Produces" "@" >}} if this is a writer.
* Add the {{< java "javax.ws.rs.Consumes" "@" >}} if this is a reader.
* Implement the necessary methods.

{{% callout ref %}}
Details about custom formats can be found [here](http://docs.oracle.com/javaee/7/api/javax/ws/rs/ext/package-summary.html).
{{% /callout %}} 
