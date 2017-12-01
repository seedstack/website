---
title: "RESTful API design"
author: "Pierre THIROUIN"
date: 2017-02-08
tags:
    - REST
    - API
zones:
    - Guides
noMenu: true
---

The [Representational State Transfer][1] (REST) architectural style was defined in 2000 by Roy Fielding. This architectural 
style defines a set of constraints based on the Web architecture.<!--more--> 

These constraints are the following:

1. Client-Server
2. Stateless
3. Cache
4. Uniform interface
5. Layered System
6. Code-On-Demand

In this guide, we will focus on the fourth constraint and how to implement it in a SeedStack application.

> REST is defined by four interface constraints: identification of
> resources; manipulation of resources through representations;
> self-descriptive messages; and, hypermedia as the engine of
> application state. Roy T. Fielding.

## Identification of resources

The identification of resources means that each resource should be accessible through an URI. For instance a book `123` 
will be accessible though the `/books/123` URI.

## Manipulation of resources through representations

Resources should be manipulated through representation. This means that you **should not** expose your resource (like a 
business object) directly because it will make refactoring impossible without breaking the clients.

## Self-descriptive messages

The messages should be context-free to respect the stateless constraint. Each message should embedded self-descripting
messaging. For this, the HTTP 1.1 specification defines a list of [HTTP verbs][4], [status codes][3], and [headers][2] to 
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

## Hypermedia as the engine of application state

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

SeedStack provides easy-to-use hypermedia tools that you can use to build such hypermedia applications or 
micro-services without pain. You can find more about these concepts [here]({{< ref "docs/web/rest.md#hypermedia" >}}).

[1]: https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
[2]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14
[3]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
[4]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
