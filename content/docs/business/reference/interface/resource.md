---
title: "Resource"
type: "reference"
zones:
    - "Business"
sections:
    - "BusinessInterfaceLayer"
menu:
    BusinessInterfaceLayer:
        weight: 30
---

Resources are main part of the REST API. This feature use the SEED REST support, for more information on it see the 
corresponding [documentation](#!/seed-doc/rest). But the SEED Business Framework also provides validation and security.

> Other resource: [Best Practices for Designing a Pragmatic RESTful API](http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#restful)

# Security

All your resource methods exposing REST API should secured unless it is explicitly required that they should be accessible
anonymously (See related [documentation](#!/seed-doc/rest)). Furthermore, all the methods which should not be accessible
to all the authenticated user should annotated with `@RequiresRoles` or `@RequiresPermissions`.

```
// Only user with "creation" permission on product can execute the method
@RequiresPermissions("product:create") 
@POST
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public Response createProduct(ProductRepresentation productRepresentation) {
   ...
}
```

# Validation

All the incoming data should be checked. For this purpose, the SEED provides the support of JSR Bean Validation 1.1. 
So all the representation coming from the users should be annotated with the `@Valid` annotation.

``` 
@RequiresPermissions("product:create")
@POST
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public Response createProduct(@Valid ProductRepresentation productRepresentation) {
   // Throws a ValidationException if the representation is not valid
   ...
}
```

# Meaningful error codes

When you design your REST API, think to the error cases.

```
@RequiresPermissions("product:create")
@POST
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public Response createProduct(@Valid ProductRepresentation productRepresentation, 
        @Context UriInfo uriInfo) throws URISyntaxException {
    ...
    return Response.created(newUri)
        .entity(productRepresentation1).build(); // Return the HTTP code 201 (created)
}

@DELETE
@Path("/{productId: [0-9]+}")
public Response deleteProduct(@PathParam("productId") long productId) {
    Product product = repository.load(productId);
    if (product == null) {
        return Response.status(Status.NOT_FOUND).build(); // return 404 (entity not found)
    }
    productRepository.delete(productId);
    return Response.status(Status.OK).build(); // return 200 (ok)
}
```

Here is a list non-exhaustive of HTTP status codes often used by REST resources. The exhaustive list can be found 
[here](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes). 

<table class="table table-bordered">
  <thead>
  <tr>
    <td>Code</td>
    <td>Status</td>
  </tr>
  </thead>
  <tr>
    <td>200</td>
    <td>Ok</td>
  </tr>
  <tr>
    <td>201</td>
    <td>Created</td>
  </tr>
  <tr>
    <td>204</td>
    <td>No content</td>
  </tr>
  <tr>
    <td>400</td>
    <td>Bad request</td>
  </tr>
  <tr>
    <td>401</td>
    <td>Unauthorized</td>
  </tr>
  <tr>
    <td>403</td>
    <td>Forbidden</td>
  </tr>
  <tr>
    <td>404</td>
    <td>Not found</td>
  </tr>
  <tr>
    <td>409</td>
    <td>Conflict</td>
  </tr>
</table>

Error 500 should be avoid and at least caught with an `ExceptionMapper`, in order to not return a complete stack trace 
to the request.

