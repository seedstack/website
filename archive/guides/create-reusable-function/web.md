---
title: "Web"
guide: "Create a reusable function"
author: "SeedStack"
menu:
    CreateFunctionGuide:
        weight: 60
---

Not all reusable functions have a Web interface but if you need to provide one, please follow the advices on this
page.

# Organization

You have two organization choices for the function Web interface. 

* Either separate the frontend and REST API in their own `static` and `rest` modules and provide a `web` module combining 
the two.
* Or either combine the frontend and REST API in one unique `web` module. If you want to offer the flexibility to reuse 
the Web UI or the REST API separately, you should use the separated module organization. If not the unique module will 
suffice.

{{% callout info %}}
In all cases, the `web` module should be packaged as a JAR (instead of a WAR) since it will allow to reuse it in client
applications without using WAR overlay techniques. SeedStack provides all the necessary infrastructure to compose Web
applications from multiple JARs.
{{% /callout %}}

# Recommendations

We recommend to use W20 for the Web UI as its modularity will be of great use for building a reusable function. When
using W20, you should observe the following rules:

* Avoid absolute paths and hard-coded prefixes,
* Avoid specific styling to maximize compatibility between themes,
* Use permissions instead of roles for security as they are independent of the client application security model and
they can be mapped very finely.

