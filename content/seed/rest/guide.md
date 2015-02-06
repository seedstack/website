This page is an introduction about JAX-RS features.

# HTTP Binding

This section will focus on the means **to bind and match http requests verbs, urls and content type** in SEED. 
Jersey has set off annotations to deal with all these aspects. For example, in order to bind a resource class with URI, just use `@Path`. 
This annotation is **mandatory** on a class to be considered as a resource. `@Path` annotation value is the relative URI path but 
it can also contain a URI template or a regex expression. For example:

```
 //on the class name
 @Path("/orders")
 public class OrderResource {
    ..
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    //on a method - it will match with /rest/orders/{orderId}
    @Path("/{orderId}")
    public Response read(@PathParam("orderId") long id) {
  	...
    }


 }
```

There is an annotation to inject to be able to work with each specific HTTP properties such as param , query, header, form , cookies ... 
JAX-RS also provides an annotation for each http verb as follows:

<table class="table table-bordered">
<thead>
<tr>
<th>Annotation</th>
<th>HTTP Verb</th>
</tr>
</thead>
<tbody>
<tr>
<td>@GET</td>
<td>GET</td>
</tr>
<tr>
<td>@POST</td>
<td>POST</td>
</tr>
<tr>
<td>@PUT</td>
<td>PUT</td>
</tr>
<tr>
<td>@DELETE</td>
<td>DELETE</td>
</tr>
<tr>
<td>@OPTION</td>
<td>OPTION</td>
</tr>
 <tr>
<td>@HEAD</td>
<td>HEAD</td>
</tr>
</tbody>
</table>

# Content handling

## Working with streams

### Send a stream

To send bytes (i.e images) JAX-RS can return special stream :

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

### Receive a stream

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

## Message body writers and readers

This section will focus on **how to serialize and deserialize a custom format**. By Default JAX-RS can work with xml and json format. 
If your project requests a custom format, see the following steps :

- Create a class which implements MessageBodyWriter or/and MessageBodyReader with the custom format in generic.
- Add `@Provider`, `@Produces` or/and `@consumes`.
- Implement methods.

More documentation is available in package [javax.ws.rs.ext](https://jersey.java.net/apidocs/1.17/jersey/javax/ws/rs/ext/package-summary.html).

# Responses

If no resource method matches an http request, Jersey will throw an **HTTP Status 405 - Method Not Allowed**. 
Http requests have to match a resource method with all of its attributes such as: URI, verb, query parameters, path parameters, produces and consumes properties.

## Build response
To build a complex response you have to use `Response` or `ResponseBuilder`. HTTP status is very important in REST applications and can be set by `Response` object.

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPerson(PersonRepresentation pr) {
        createPersonActivity.create(pr);
        URI newUri = new URI(this.uriInfo.getRequestUri().toString() + "/" + pr.getId());
        return Response.created(newUri).entity(pr).build();
    }

## Exception Mapper

This section will focus on **how to deal with Business Exceptions**. By default, Jersey converts all exceptions to HTTP status 500 error (internal server error). 
Creating an `ExceptionMapper` can be created in order to manage business exceptions more specifically. For example :

    @Provider
    public class EntityNotFoundMapper implements
        ExceptionMapper<EntityNotFoundException> {

       public Response toResponse(EntityNotFoundException e) {
          return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

In this ExceptionMapper, `EntityNotFoundException` is bound to **HTTP status 404 error (not found)**.
When `EntityNotFoundException` is thrown in resource code, Jersey will send a 404 error instead of the default 500 error.






