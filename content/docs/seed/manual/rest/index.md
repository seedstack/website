---
title: "Overview"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedRest"
tags:
    - "rest"
    - "jax-rs"
    - "maven"
menu:
    SeedRest:
        weight: 10
---

Seed REST support provides a set of Java APIs for exposing resources according to the Representational State Transfer (REST).
Resources are created using the JAX-RS specification (and [Jersey](https://jersey.java.net/) its reference implementation).
This page describes how to use the basic features of JAX-RS. For a detailed explanation on how to create a RESTful API, refer to [this page](restful-api).

To start creating a REST API make sure that you have the following dependency in your project:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-rest-support-core</artifactId>
    </dependency>


# Resources

In the context of JAX-RS, resources are classes annotated with `@Path`. All these classes are automatically detected and registered by Seed.
This means that you can inject any other classes managed by Seed in your resources. A new instance of the resource class is created for each request.

{{% callout info %}}
In order to avoid possible conflict with static resources, all REST resources are prefixed by default with `/rest/`.
{{% /callout %}}

Here is an example of a simple "Hello World" REST resource. This resource is exposed by default on `/rest/hello`.

    @Path("/hello")
    public class HelloResource {

        @GET
        @Produces("text/plain")
        @Path("/{msg}")
        public String sayHello(@PathParam("msg") String message) {
            return Response.ok("Hello " + message).build();
        }

    }

Request the resource:

    curl 'http://localhost:8080/rest/hello/world'

The reponse will indicate:

```plain
Hello world
```

# HTTP binding

An HTTP request is mapped to resource method according to its: path,
verb and content-type. If no resource method matches an HTTP request
an HTTP status 405 (Method not allowed) will be returned.

## Path

The path is determined with the annotation `@Path`. This annotation is
**mandatory** on the class and can be also added on the method to express
subresources. The annotation [value][1] is the relative URI path but can
also contain a URI template or a regex expression.

## HTTP verb

The HTTP verb (GET, POST, PUT, DELETE, etc.) are
determined via their respective annotations: `@GET`, `@POST`, etc.

## Content-type

Finally the content type is determined with `@Produces(MediaType.APPLICATION_JSON)`
and `@Consumes(MediaType.APPLICATION_JSON)`


# Response

JAX-RS allows to return detailed response, with the resource
representation and an HTTP status code. For instance the following
resource will return a HTTP status code 201 (Created) with the URI of
the created resource.

```
@POST
public Response createPerson(PersonRepresentation pr) {
    PersonRepresentation createdPerson = accountService.register(pr);
    URI newUri = new URI(this.uriInfo.getRequestUri().toString()
	    + "/" + createdPerson.getId());
		
    return Response.created(newUri).entity(createdPerson).build();
}
```

# Exception handling

Exception handling is an important part of API design. 
Carefully designed error handling will allow you to provide meaningful status codes and messages to the client and avoid to dump stacktraces in your HTTP response.
There are two ways of handling exception with JAX-RS:

* Create a custom exception extending `WebApplicationException`.

```
public class NotFoundException extends WebApplicationException {

    public NotFoundException(String msg) {
	    super(Response.status(Response.Status.NOT_FOUND).entity(msg).build());
    }
}
```

When the exception will be thrown, the server will return an HTTP status code `404`.

* Map existing exceptions to `Response` using an `ExceptionMapper`. 

```
@Provider
public class MyBusinessExceptionMapper implements ExceptionMapper<MyBusinessException> {

    @Override
    public Response toResponse(MyBusinessException exception) {
        return Response.status(Response.Status.BAD_REQUEST)
                   .entity(exception.getMessage()).build();
    }
}
```

All the uncaught `MyBusinessException` will be mapped to an HTTP
status code `400`.

{{% callout info %}}
Like resources, providers are automatically detected and registered by Seed.
{{% /callout %}}


---
**Additional resources:**

* [Roy Fielding dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
* [JAX-RS javadoc](http://docs.oracle.com/javaee/7/api/javax/ws/rs/package-summary.html)
* [Jersey documentation](https://jersey.java.net/documentation/latest/index.html)

[1]: https://docs.oracle.com/javaee/7/api/javax/ws/rs/Path.html#value--
