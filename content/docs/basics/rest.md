---
title: "REST API"
type: "home"
zones:
    - "Docs"
tags:
    - web
    - rest
    - api
menu:
    docs:
        parent: "basics"
        weight: 6
---

We already have a minimal REST API that says `Hello World!` in our demo application. In this page we will enrich the
API with some SeedStack 
 
## A Swagger descriptor

[Swagger](https://swagger.io/) is a popular API description format. It helps in discovering API, whereas by humans or
by machines.

To add a Swagger descriptor to our project, we just need to add the following dependency:

{{< dependency g="org.seedstack.addons.swagger" a="swagger" >}}    
 
To see the Swagger descriptor, restart the application and point your browser to

```plain
http://localhost:8080/swagger.json
``` 

You should see an empty Swagger descriptor. That's because we haven't declared any REST resource as a discoverable API.
Now annotate the `HelloResource` class with {{< java "io.swagger.annotations.Api" "@" >}}:

```java
package org.generated.project.interfaces.rest;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.generated.project.domain.model.person.PersonRepository;
import org.generated.project.domain.services.GreeterService;
import org.seedstack.business.util.inmemory.InMemory;

@Path("hello")
@Api
public class HelloResource {
    @Inject
    @InMemory
    private PersonRepository personRepository;
    @Inject
    private GreeterService greeterService;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return personRepository.findByName("ella")
                .findFirst()
                .map(greeterService::greet)
                .orElseThrow(NotFoundException::new);
    }
}
```

The JSON descriptor should now contain the basic information on the `/hello` API. If we want something more human-friendly,
we can display the descriptor inside the [Swagger demo UI](http://petstore.swagger.io/). 

On the Swagger UI, enter the application Swagger descriptor URL in the top field and press "Explore".

{{% callout info %}}
For now, you should see a failure due to the descriptor being loaded from a different origin (`localhost`) than the
displayed page (`petstore.swagger.io`). We will fix that by enabling [Cross-Origin Resource Sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
on our app.  
{{% /callout %}}

## Enable CORS

To enable CORS, just add the following configuration at the bottom of the `application.yaml` file:

```yaml
web:
    cors: true
```

{{% callout info %}}
Learn more about CORS options on the [CORS documentation page]({{< ref "docs/web/cors.md" >}}). 
{{% /callout %}}

## See the result

Now refresh the browser page. You should see a human-friendly version of the Swagger descriptor.

If you click on the `/hello` API, you can try it out directly from this UI.
 
## Now what ?

### What we learned

In this page you have learned:

* How to add a Swagger descriptor for your REST API,
* How to enable CORS to make your REST API available from other origins. 

### Troubleshooting

If you can't get this to work, check the [troubleshooting page]({{< ref "docs/basics/troubleshooting.md" >}}).

### Next step

If you want to learn more, continue on the tutorial to learn about [testing]({{< ref "docs/basics/testing.md" >}}).

