---
title: "Restful API"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedRest"
tags:
    - "rest"
    - "hypermedia"
    - "hateoas"
menu:
    SeedRest:
        weight: 30
---

The [Representational State Transfer][1] (REST) architectural style was
defined in 2000 by Roy Fielding. This architectural style defines a
set of constraints based on the Web architecture. These constraints
are the following:

1. Client-Server
2. Stateless
3. Cache
4. Uniform interface
5. Layered System
6. Code-On-Demand

In this page, we will focus on the fourth constraint (uniform interface) and how to implement it in a Seed-based
application.

> REST is defined by four interface constraints: identification of
> resources; manipulation of resources through representations;
> self-descriptive messages; and, hypermedia as the engine of
> application state. Roy Fielding.

# Identification of resources

The identification of resources means that each resource
should be accessible through an URI. For instance a book `123` will be accessible
though the `/books/123` URI.

# Manipulation of resources through representations

Resources should be manipulated through representation. This means that you
**should not** expose your resource (like a business object) directly because it will make
refactoring impossible without breaking the clients.

# Self-descriptive messages

The messages should be context-free to respect the stateless
constraint. Each message should embedded self-descripting
messaging. For this the HTTP 1.1 specification defines a list of [HTTP
verbs][7], [status codes][6], and [headers][2] to exchange metadata.
For instance the following JAX-RS method specify that the HTTP verb is
`POST`, it accepts the media type `application/json` and return `201` (Created).

```
@POST
@Consumes(MediaType.APPLICATION_JSON)
public Response createPerson(PersonRepresentation pr) {
    PersonRepresentation createdPerson = accountService.register(pr);
    URI newUri = new URI(this.uriInfo.getRequestUri().toString()
	    + "/" + createdPerson.getId());
		
    return Response.created(newUri).entity(createdPerson).build();
}
```

# Hypermedia as the engine of application state (HATEOAS)

According to Roy T. Fielding, a REST API is a set of resources that
can be explored by following links. Each resource is a representation
of a state of the application and the links are the transitions
between those states. 

> The name "Representational State Transfer" is intended to evoke an
> image of how a well-designed Web application behaves: a network of
> web pages (a virtual state-machine), where the user progresses
> through the application by selecting links (state transitions),
> resulting in the next page (representing the next state of the
> application) being transferred to the user and rendered for their
> use. Roy T. Fielding.

## Advantages

1. The state of the application controlled by
the server as it tells the client what it can do next.
2. It allows the refactoring of server's URI scheme without breaking clients.
3. It helps client developers to explore the API.
4. It allows the server developers to advertise deprecation or new
   capabilities by adding hints on existing links or by adding
   new links.

The benefits of an hypermedia API are obvious. But it is often
seen as difficult to implement in real life applications. With Seed,
we want to make it so easy that all Seed REST application will support
hypermedia by default. In order to do this, Seed supports two dedicated
media types. They are both based on JSON and describe conventions to link 
to other resources.

First, to ease the API exploration, Seed exposes an API home resource
with the [JSON-HOME][3] media type. It's the same concept as a website
home page but for REST APIs.

## JSON-HOME

The goal of the JSON-HOME media type is to expose an home resource
which provides all the entry points of the application's API. It tells
the client developer what it can do and give him hints on how to use
the resources.

The following example shows a JSON-HOME resource with two entry
points "widgets" and "widget". For the "widgets" resource, the
JSON-HOME provides just an href indicating the URI of the
resource. But for the "widget" resource, the JSON-HOME provides
an href-template instead. 

```
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

To expose a JAX-RS resource in the JSON-HOME resource, annotate the
resource with `@Rel` and set the home attribute to `true`. The annotation
can be on the class or the method.

```
@Rel(value = CatalogRels.PRODUCT, home = true) // Add it to JSON-HOME
@Path("/products/{title}")
@Produces({MediaType.APPLICATION_JSON, "application/hal+json"})
public class ProductResource {

    @GET
    public Response getProduct() {
        ...
    }
}
```

## Hypertext Application Language (HAL)

Now that your API is exposed on an "home page", you have to provide a way to
navigate between these pages. That's the role of the [HAL+JSON][4] media type,
which establishes conventions for expressing hypermedia controls.

An HAL representation look like this:

```
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
`_links` and `_embedded`.

### Links

The property `_links` is used to share links
to other resources. Links are represented as a set of keys and
values. The keys represents a relation type (rel) and the value a link
object. The only required value of the link object is `href` which can
be an URI or an URI template (`/orders{?id}`).
By convention, a resource always returns a `self` link with its own
URI. However, the propery `_links` is optional. For more information
on link object see the [section 5][5] of the specification.

### Embedded

The property `_embedded` is a set of keys and values. Keys are
relation types and values can be a resource object or an array of
resource objects. The embedded resources can be full or partial
representations of a resource.

### Exposing HAL representations

Seed provides an handy API to simplify the creation of HAL
representations. First, you can take an existing representation and
transform it to an HAL representation using the `HALBuilder`.

```
HalRepresentation representation = HalBuilder.create(ProductRepresentation)
                .self("/rest/products/" + productId)
				.link("tags", "/rest/products/" + productId + "/tags");
				.embedded("related", relatedProducts);
```

The second option is to make your representation inherit the
`HalRepresentation`.

```
public class ProductsRepresentation extends HalRepresentation {

    private long totalProduct;

    private long currentPage;

    ProductsRepresentation() {
    }

    public ProductsRepresentation(PaginatedView<ProductRepresentation> page) {
        this.totalProduct = page.getResultSize();
        this.currentPage = page.getPageIndex();
        embedded("products", page.getView());
    }

    public long getTotalProduct() {
        return totalProduct;
    }

    public long getCurrentPage() {
        return currentPage;
    }
}
```

### RelRegistry

Concatenating strings for building hrefs can quickly become painful and
error-prone. With Seed, you have access to a `RelRegistry` which can greatly
simplify the task. This registry contains all the resources annotated by 
`@Rel` and their href. For instance the href of the following resource:

```
@Path("/products")
public class ProductsResource {
    
    GET
    Rel(value = CatalogRels.CATALOG) // defines the resource rel
    Produces({MediaType.APPLICATION_JSON, "application/hal+json"})
    ublic Response products(@DefaultValue("0") @QueryParam("pageIndex") Integer pageIndex,
                            @DefaultValue("10") @QueryParam("pageSize") Integer pageSize) {
       ...
    }
}
```

... can be created as follows:

```
String self = relRegistry.uri(CatalogRels.CATALOG)
                         .set("pageIndex", pageIndex)
                         .set("pageSize", pageSize).expand()
```


[1]: https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
[2]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14
[3]: http://tools.ietf.org/html/draft-nottingham-json-home-03
[4]: https://tools.ietf.org/html/draft-kelly-json-hal-06
[5]: https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5
[6]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
[7]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
