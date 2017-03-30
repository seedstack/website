---
title: "Package layout"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessEssentials"
tags:
    - essentials
    - domain-driven design
    - architecture
menu:
    BusinessEssentials:
        weight: 40
---

We recommend a well-defined package layout for organizing your business code according to the software architecture 
described above.

# The domain

The root package for the domain layer is:

```plain
[base.package].domain
```
    
The domain can be composed of several sub-domains that can be specified as sub-packages: 

```plain
[base.package].domain.subdomain1
[base.package].domain.subdomain2
...
```

The domain package (or each sub-domain package if relevant) contains:
 
* A `model` package containing aggregates, each in its own package. An aggregate package contains
  * The aggregate root along with other related entities and value objects,
  * The factory interface if any,
  * The repository interface if any,
  * The aggregate policies if any.
* A `services` package containing domain services.
 
```plain
[base.package].domain
    - model
        - aggregate1
            - AggregateRoot
            - SubEntity1
            - SubEntity2
            - SomeValueObject
            - AggregateFactory
            - AggregateRepository
            - AggregatePolicy
            
        - aggregate2
            ...
            
    - shared
        - SharedValueObject
        - SharedPolicy

    - services
        - DomainService1
        - DomainService2
```

{{% callout warning %}}
Implementations can be located alongside their interface if they are independent of any technical aspect. 
Otherwise they must be located in the infrastructure.
{{% /callout %}}

# The application

The root package for the application layer is:

```plain
[base.package].application
```

The application package contains application services and related classes necessary to implement applicative logic and
use cases. This package can then be split into sub-packages as you see fit. 

```plain
[base.package].application
    - ApplicationService1
    - ApplicationService2
    ...
```

{{% callout warning %}}
As for the domain, implementations can be located alongside their interface if they are independent of any technical aspect. 
Otherwise they must be located in the infrastructure.
{{% /callout %}}

# The interface(s)

The root package for the interface layer is:

```plain
[base.package].interfaces
```

Each interface type has its own root package:

```plain
[base.package].intefaces.rest
[base.package].intefaces.ws
[base.package].intefaces.cli
...
```

Each interface type root package can then be split into sub-packages as you see fit. **Interfaces should never directly expose
the domain to the outside world but map the domain to Data Transfer Objects (DTO).** There are two main ways of obtaining
DTO:
 
* Using assemblers to map domain aggregate(s) to DTO,
* Directly construct DTO from persistence using finders. 

Both should be placed alongside the DTO, in the same package. 
    
```plain
[base.package].interfaces.rest
    - resource1
        - Representation1
        - Representation1Assembler
        - Representation1Resource
        - Representation1Finder
    - resource2
        ...
```

{{% callout warning %}}
As for the domain and the application, implementations can be located alongside their interface if they are independent 
of any technical aspect. Otherwise they must be located in the infrastructure.
{{% /callout %}}

# The infrastructure

The root package of the infrastructure layer is:

```plain
[base.package].infrastructure
```

Each technology has its own root package:
  
```plain
[base.package].infrastructure.jpa
[base.package].infrastructure.file
[base.package].infrastructure.mongo
...
```
