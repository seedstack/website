---
title: "REST"
type: "home"
zones:
    - "Docs"
sections:
    - "Manual"    
tags:
    - REST
    - API
    - web
    - interfaces
aliases: /docs/seed/manual/rest    
menu:
    docs-manual:
        weight: 3
        parent: "web"
---

The `seed-rest-core` and its companion modules provides support for exposing REST resources using JAX-RS. SeedStack implements 
the JAX-RS standard through the [Jersey 2](https://jersey.github.io/) implementation.<!--more-->

REST support requires the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-rest-jersey2" >}}

## Configuration

The following configuration options are available:

{{% config p="rest" %}}
```yaml
rest:
  # The base path of REST resources which will prefix all resource paths
  path: (String) 
  
  # Set of Jersey features to enable
  features:
    - (Class<?>)
   
  # The base URI used for building hypermedia params 
  baseParam: (String)
   
  # The base URI used for building hypermedia rel 
  baseRel: (String) 
  
  # If true, a JSON-Home resource describing REST entry-points will be served on REST base path
  jsonHome: (boolean) 
  
  # Allows to specify custom Jersey properties (key: property name, value: property value)
  jerseyProperties: 
    key: (String)
   
  # If JSP support is enabled, the path where JSP files are located
  jspPath: (String) 
  
  exceptionMapping:
    # If true, security exceptions are automatically mapped to adequate HTTP responses
    security: (boolean)   

    # If true, all exceptions not already mapped are mapped to a 500 HTTP response
    all: (boolean) 
```
{{% /config %}}  

### Base path

REST resources are exposed on `/` by default. This is fine for micro-services only serving REST APIs but you can choose 
to avoid potential conflicts with other application resources by changing the base path with the `path` configuration property.

### Jersey features

The following features are automatically enabled when discovered on the classpath:

* **Multipart**. Being included as a dependency to the `seed-rest-jersey2` module so it is always enabled unless explicitly 
excluded from the classpath.
* **JSP**. This feature is enabled when the `org.glassfish.jersey.ext:jersey-mvc-jsp` dependency is present in the classpath.
The path where the JSP files must be located is controlled by the `jspPath` configuration property.

Other features must be explicitly enabled by:

* Adding the dependency if necessary.
* Adding the fully qualified class name to the `features` configuration property.

### Jersey properties

You can specify custom Jersey 2 properties in the `properties` option. They will be passed to the Jersey runtime as is.
 
{{% callout ref %}}
The reference of all Jersey 2 properties can be found [here](https://jersey.github.io/documentation/latest/appendix-properties.html).
{{% /callout %}} 

### Hypermedia settings

The `baseRel`, `baseParam` and `jsonHome` control the behavior of the hypermedia engine.
 
### Exception mapping

SeedStack default exception mapping is controlled by the following configuration properties:
 
* `security`: if true {{< java "org.seedstack.seed.security.AuthenticationException" >}} and {{< java "org.seedstack.seed.security.AuthorizationException" >}} 
security exceptions thrown from a JAX-RS resource are respectively mapped to a 401 and a 403 HTTP responses. This is enabled by default.
* `all`: if true any exception thrown from a JAX-RS resource not already mapped by another exception mapper is mapped to
a 500 HTTP response (without stacktrace to avoid leaking technical information). This is enabled by default.

{{% callout tips %}}
If you need to display exception stacktraces during development, disable those exception mappers. Be sure to re-enable
them for production systems.
{{% /callout %}} 

## Usage

SeedStack automatically detects:
 
* JAX-RS resources (concrete classes annotated with {{< java "javax.ws.rs.Path" "@" >}})
* JAX-RS providers (concrete classes annotated with {{< java "javax.ws.rs.ext.Provider" >}})

These classes are injectable and interceptable:

```java
@Path("/products")
public class ProductsResource {
    @Inject
    private CatalogService catalogService;
    
    @GET
    @Path("/{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public ProductRepresentation findProduct(@PathParam("id") long productId) {
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

{{% callout ref %}}
You can find more information about how to work with JAX-RS in [this guide](/guides/jaxrs-basics). 
{{% /callout %}}

## Hypermedia

SeedStack implements hypermedia with two main features:
 
* JSON-HOME which allows to discover an application or micro-service global REST resources.
* Hypertext Application Language (HAL) which is a popular media-type for representing hypermedia-capable resources.

### JSON-HOME

To ease REST API discovery, SeedStack exposes an API home resource with the [JSON-HOME][1] media type. 
This is similar to a Website homepage but for REST APIs.

The goal of the JSON-HOME media type is to expose an home resource which provides all the entry points of the application's 
API. It tells the client developer what it can do and give him hints on how to use the resources.

The following example shows a JSON-HOME resource with two entry points "products" and "product". For the "products" resource, 
the JSON-HOME provides just an href indicating the URI of the resource. But for the "product" resource, the JSON-HOME provides
an href-template instead. 

```json
{
  "resources": {
    "http://example.org/rel/products": {
      "href": "/products",
      "hints": {
        "allow": ["POST"],
        "formats": {
          "application/json": {}
        },
        "accept-patch": ["application/json-patch"]
      }
    },
    "http://example.org/rel/product": {
      "href-template": "/products/{productId}",
      "href-vars": {
        "productId": "http://example.org/params/productId"
      },
      "hints": {
        "allow": ["GET"],
        "formats": {
          "application/json": {}
        },
        "accept-patch": ["application/json-patch"]
      }
    }
  }
}
```

To expose a JAX-RS resource in the JSON-HOME resource, annotate the resource with {{< java "org.seedstack.seed.rest.Rel" "@" >}} 
and set the home attribute to `true`. The annotation can be on the class or the method.

```java
@Path("/products")
public class ProductsResource {
    @Inject
    private CatalogService catalogService;
    
    @GET
    @Path("/{id}")
    @Produces({MediaType.APPLICATION_JSON, "application/hal+json"})
    @Rel(value = "product", home = true)
    public ProductRepresentation findProduct(@PathParam("id") long productId) {
        Optional<Product> product = catalogService.findProduct(productId);
        if (!product.isPresent()) {
            throw new NotFoundException("Product " + productId + " cannot be found");
        }
        return new ProductRepresentation(product.get());
    }
    
    @POST
    @Produces({MediaType.APPLICATION_JSON, "application/hal+json"})
    @Rel(value = "product", home = true)
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

### Hypertext Application Language (HAL)

Beyond providing an "API homepage", you have to provide a way to navigate between these pages. That's the role of the 
[HAL+JSON][2] media type, which establishes conventions for expressing hypermedia controls. An HAL representation 
looks like this:

```json
{
  "_links": {
    "self": { "href": "/products" },
    "next": { "href": "/products?page=2" },
    "find": { "href": "/products{?id}", "templated": true }
  },
  "_embedded": {
    "products": [{
        "_links": {
          "self": { "href": "/products/123" },
          "status": { "href": "/products/123/status" }
        },
        "price": 30.00,
        "designation": "Product 123"
      }, {
        "_links": {
          "self": { "href": "/products/124" },
          "status": { "href": "/products/124/status" }
        },
        "price": 20.00,
        "designation": "Product 124"
    }]
  },
  "totalProductCount": 245,
  "latestCatalogUpdate": "2017-02-08"
}
```

It is a JSON representation with just two reserved keywords: 

* `_links`: this property is used to share links to other resources. Links are represented as a set of keys and
values. The keys represents a relation type (rel) and the value a link object. The only required value of the link object 
is `href` which can be an URI (`/products/123`) or an URI template (`/products{?id}`). By convention, a resource always 
returns a `self` link with its own URI. However, the propery `_links` is optional. For more information on link object 
see the [section 5][3] of the specification.
* `_embedded`: this property is a set of keys and values. Keys are relation types and values can be a resource object or 
an array of resource objects. The embedded resources can be full or partial representations of a resource. 

#### Building hypermedia links

Concatenating strings for building URI can quickly become painful and error-prone. With SeedStack, you can inject the
{{< java "org.seedstack.seed.rest.RelRegistry" >}} interface which can greatly simplify the task. This registry tracks 
all the resources annotated by {{< java "org.seedstack.seed.rest.Rel" "@" >}} and can build hypermedia links in two forms:

* An expanded form, where all variables are sent already resolved to the client,
* A templated form, where the URI template is sent as-is to the client.

Consider the following resource:

```java
@Path("/products")
public class ProductsResource {
    @GET
    @Rel(value = "products") // defines the resource rel
    @Produces({MediaType.APPLICATION_JSON, "application/hal+json"})
    public List<ProductRepresentation> listProducts(
            @QueryParam("pageIndex") @DefaultValue("0") Integer pageIndex,
            @QueryParam("pageSize") @DefaultValue("10") Integer pageSize) {
       
    }
}
```

The expanded link is created as follows:

    Link link = relRegistry.uri("products") // specifies the target resource rel
                           .set("pageIndex", pageIndex)
                           .set("pageSize", pageSize);

Which will be serialized to the following form:

```json
{ 
  "href": "/products?pageIndex=0&pageSize=10"
}
```
    
The templated link can be created as follows:

    Link link = relRegistry.uri("products") // specifies the target resource rel
                           .templated();
                             
Which will be serialized to the following form:

```json
{ 
    "href": "/products{?pageIndex,pageSize}", 
    "templated": true 
}
```

{{% callout info %}}
Note that SeedStack will automatically use the Servlet context path and the REST prefix to build HAL links, alleviating 
the need for you to build any URI manually.
{{% /callout %}}

#### Creating HAL representations

SeedStack provides two options to simplify the creation of HAL representations. First, you can take an existing representation 
and transform it to an HAL representation using the `HALBuilder`:

```java
@Path("/products")
public class ProductsResource {
    @Inject
    private CatalogService catalogService;
    @Inject 
    private RelRegistry relRegistry;
    
    @GET
    @Path("/{id}")
    @Produces({MediaType.APPLICATION_JSON, "application/hal+json"})
    @Rel(value = "product", home = true)
    public HalRepresentation findProduct(@PathParam("id") long productId) {
        // Find the product
        Optional<Product> product = catalogService.findProduct(productId);
        if (!product.isPresent()) {
            throw new NotFoundException("Product " + productId + " cannot be found");
        }
        
        // Build the product representations
        ProductRepresentation productRepresentation = new ProductRepresentation(product);
        List<ProductRepresentation> relatedProducts = catalogService
            .findRelatedProducts(product)
            .stream()
            .map(ProductRepresentation::new)
            .collect(toList());
        
        // Create an HAL representation from product representations
        return HalBuilder
                .create(product)
                .self(relRegistry.uri("products").set("id", product.getId()))
                .link("find", relRegistry.uri("product").templated())
                .embedded("related", relatedProducts);
    }
}
```

The second option is to make your representation extends {{< java "org.seedstack.seed.rest.hal.HalRepresentation" >}}:

```java
public class ProductHalRepresentation extends HalRepresentation {
    private long id;
    private String designation;

    ProductHalRepresentation() {
    }

    public ProductHalRepresentation(RelRegistry relRegistry, Product product, List<Product> relatedProducts) {
        this.id = product.getId();
        this.designation = product.getDesignation();
        
        self(relRegistry.uri("products").set("id", product.getId()));
        link("find", relRegistry.uri("find").templated());
        embedded(
                "products", 
                relatedProducts.stream()
                    .map(relatedProduct -> new ProductHalRepresentation(relRegistry, relatedProduct, new ArrayList<>()))
                    .collect(toList())
                );
    }
}
```


[1]: http://tools.ietf.org/html/draft-nottingham-json-home-03
[2]: https://tools.ietf.org/html/draft-kelly-json-hal-06
[3]: https://tools.ietf.org/html/draft-kelly-json-hal-06#section-5
