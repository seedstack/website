---
title: "HATEOAS"
type: "manual"
zones:
    - "W20"
sections:
    - "W20Core"
menu:
    W20Core:
        weight: 50
---

HATEOAS (Hypermedia As The Engine Of Application State) is a powerful architecture where the application can consume
REST resources through structured links relations between those resources. Navigation through APIs resemble web 
navigation: from a web page it is possible to follow links to new documents. In the same way, HATEOAS provides a 
mechanism to interact with remote data with navigation and discoverability in mind.

For an overview of this concept, please refer to the documentation of the 
Java framework @ [Restful API](../../../../seed/manual/rest/restful-api/).

# Hypermedia module

To enable the hypermedia module, declare it in the core fragment configuration.

```
 "hypermedia": {}
```

Available configuration for this module is provided below along with short introductions to 
the hypermedia formats supported.

# Hypermedia resources

## JSON-HOME

The MIME type [application/json-home](http://tools.ietf.org/html/draft-nottingham-json-home-03) specify a 
document "map" of resources  that can serve as entry points for clients into an hypermedia api.

### Json-home sample: catalog and product
```
    {
        "resources": {
            "catalog": {
                "href": "api/products"
            },
            "product": {
                "href-template": "api/product/{name}",
                "href-vars": {
                    "name": "api/doc/param/name"
                }
            }
        }
    }
```

In this scenario a client can enter a commercial api by requesting the json home document which will provide it 
with two ***relations***: 

- ***"catalog"*** with an URI defined in the ***href*** property which, when queried, could for instance return a 
list of available products in the catalog.

- ***"product"*** with an [URI template](https://tools.ietf.org/html/rfc6570) defined in the ***href-template*** 
property which uses the name of a product as a criteria for the query. Note that since we are using an 
URI template, the property is href-template instead of href. Now, how should this parameter be used ? Whether by 
implicit knowledge or through documentation for parameters that can be provided in a ***href-vars*** property. 
This allows client to discover the usability of an api by querying the URL at this location.

More information can be provided in a json home document such as ***hints*** for available actions on the resource 
and/or accepted format. We advice you to take a look at the specification for an exhaustive documentation of the 
json home document type.

### Configuring Json home endpoints

In your hypermedia module declaration of the core fragment, specify the api endpoint which exposes your json-home 
resources with the `api` property:

```
"api": {
    "myFirstApi": "http://domain:port/",
    "mySecondApi": "/"
}
```

You can specify a full absolute url (starting with the http/https protocol) or an absolute url (starting with "/"). 
In the last case, the domain and port from which the application is served will be used as the hostname of the api.

### Using alias

You can use alias for your api endpoint to refer to a previously declared api.

```
"api": {
    "namedAlias": "http://domain:port/",
    "myApi": "@namedAlias"
}
```

There is one default alias `@home` which resolve to ***/rest/***

```
"api": {
    "home": "@home"
}
```

### HomeService

The `HomeService` allows you to interact with the declared api endpoint(s). All endpoint declared in the manifest
are automatically registered. To access an api use the following declaration:

```
homeService('<api>');//<api> is the property used to reference the api URL
```


The service has 3 methods:

- `enter(api, parameters, actions, options)`: Provide a modified $resource object configured from a registered home 
resource. It signature is the same as the $resource service of AngularJS but instead of providing a url as the first 
parameter, you provide the name of the wanted relation provided in the Json home document. Another important difference
is that only the get method is available by default on the returned object since it is used only for retrieving entry 
point resources.

```
homeService('myApi').enter('catalog').get(function (products) {
    ...
};
```

- `register(jsonHomeResource)`: Programmatically register a new resource. The resource should respect the format for
a Json-home document resource.

```
homeService('myApi').register({
    "someNewResource": {
        "href": "/some/url/"
    }
});
```

- `getDefinition(resourceNAme)`: Return the definition of the resource.

```
homeService('myApi').getDefinition('someNewResource'); 
// { "href": "/some/url/" }

```


## HAL (Hypertext Application Language)

W20 provide support for [application/hal+json](http://stateless.co/hal_specification.html) resources. If Json home 
document constitute a "map" of the available entry points to the api, HAL is the format for these entry points and 
any subsequent resources obtained by following the links provided in these resources. Check the example below:

### HAL sample: querying products

```
{
  "currentPage": 1,
  "totalProduct": 20,
  "_links": {
    "self": {
      "href": "/api/products?page=1"
    },
    "next": {
      "href": "/api/products?page=2"
    },
    "find": {
      "href": "/api/products{?q}",
      "templated": true
    }
  },
  "_embedded": {
    "products": [
      {
        "name": "myProduct",
        "_links": {
          "self": {
            "href": "/api/product/myProduct"
          }
        },
        "_embedded": {
          "related": [
            {
              "name": "productRelatedToMyProduct",
              "_links": {
                "self": {
                  "href": "/rest/product/myProduct/related"
                }
              }
            }
          ]
        }
      }
    ]
  }
}
```

HAL document must validate against the JSON specification and contains two important recognizable fields:

- ***_links*** which is mandatory and must contain at the very least a ***"self"*** property which reference 
the resource itself. Additional links constitute the actual power of hypermedia: they provide additional resources 
in the form of named actions/resources. In this example two actions are available: going to the next page by following 
the "next" links or finding a product through the "find" links. This last one uses URI template to define
the available query parameter.

- ***_embedded*** is not mandatory but allow to provide embedded resources directly in the response. In this example
we embedded a list of products (with one element). Each embedded resources respect itself the HAL specification 
so it must contain a "_links" with a reference to itself and optional embedded resources.

### Usage

When a resource is served with the application/hal+json MIME type, the hypermedia module will intercept the response 
and return a $resource object augmented with two additional methods:

- `$links(link, parameters, actions, options)`: This method has the same signature as $resource but will use the name
of the links instead of the url. Suppose we return the HAL document above when querying the catalog api. We can get
the next page by following the "next" link.

```
homeService('myApi').enter('catalog').get(function (products) {

    var nextProductPage = products.$links('next').get();

});
```

If the $links method is called without parameter, it returns a list of the available links on the resource.

- `$embedded(name)`: If the resource contains embedded items, they can be accessed with this method. Suppose we
return the HAL document above when querying the catalog api. We can get the embedded items with the following 
declaration

```
homeService('myApi').enter('catalog').get(function (products) {

    var embeddedProducts = products.$embedded('products');
    console.info(embeddedProducts.name); // "myProduct"
    
    var relatedProducts = embeddedProducts.$embedded('related')[0].$links('self').get();
    
    // the last line will GET /rest/product/myProduct/related

});
```

Note: Although we used the HomeService in these example to start querying the api, it is not an obligation. Provided 
that a resource is served with the MIME type application/hal+json, we could have used a simple $resource object to 
start querying the api with a url.

# Manual interception

By default if the hypermedia module is configured and a resource is served with the MIME type application/hal+json, the
response will automatically be intercepted and processed according to what we said above. If you want to disable this
behavior and intercept response manually you need to set the `interceptAll` property to false in the hypermedia module
configuration.

```
"hypermedia": {
    "interceptAll": false
}
```

To do a manual interception you then need to inject the `HypermediaRestAdapter` and use it as follow:

```
 HypermediaRestAdapter.process(response.data).then(function (processedResponse) {
    ...
});
```

# Additional configuration

```
"hypermedia": {
    "api": { // key-value pair of api endpoint name and url },
    "interceptAll": true, (default)  // Intercept all hal+json response automatically
    "linksKey": "_links", (default) // Rename the links key
    "linksHrefKey": "href", (default) // Rename the href key
    "linksSelfLinkName": "self", (default) // Rename self link
    "embeddedKey": "_embedded", (default) // Rename embedded key
    "embeddedNewKey": "$embedded", (default) // Rename the embedded function
    "resourcesKey": "$links", (default) // Rename the links function
}
```







