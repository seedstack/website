---
title: "Structure"
guide: "Create a reusable function"
author: "SeedStack"
menu:
    CreateFunctionGuide:
        weight: 20
---

A function is a project structured in several sub-modules:

* `bom`: importable dependency management information for all function modules,
* `doc`: markdown documentation,
* `specs`: public API and SPI,
* `core`: implementation (depends on the specs module),
* `rest`: REST API (depends on the core module),
* `static`: the Web UI like a [W20 fragment](/docs/w20/concepts/fragment) as a pure frontend project,
* `web`: the Web UI repackaged from the static module in a resource JAR (depends on the rest module).

Note that the `rest` and `static` modules are mostly useful in very modular functions that allow reuse of the frontend 
Web UI separately from the REST API backend. In this case the `web` module acts as a repackaged all-in-one web artifact
(with the static UI repackaged under `META-INF/resource` and the REST API as dependency). 

You can ignore this distinction to simplify the structure and place the REST API along the static UI directly into the 
`web` module. Though by doing this, you will prevent the ability for the function clients to reuse the REST API and the 
static UI independently.   

{{% callout warning %}}
Avoid using the seed distribution and its composites directly in your function as it will force the dependency management
used by the function upon its clients. Just use the minimum required dependencies to the function directly. 
{{% /callout %}}

