---
title: "Architecture"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessConcepts"
menu:
    BusinessConcepts:
        weight: 30
---

For starters, it is important to know that DDD doesn't require a particular architecture. Since the domain is defined
and contained inside a {{< term "bounded context" >}}, it doesn't influence the architecture of the whole application
or system. There are several pertinent architectural styles that you can apply to the surroundings of the domain. Some
are very broad and tend to define every aspect of the system, others are more focused and try to address a specific
demand. 

The business framework can itself adapt to several of these architectural styles. In this section we will present
the **layers architecture pattern**.
  
# Layers

The layers architecture pattern is commonly used in Web, enterprise and desktop applications. In this architecture
pattern, the concerns are separated into well-defined layers.

## Traditional definition

The main rule of this pattern is that each layer may couple only to itself and below. The strict layers architecture
only allows to couple to the layer directly below. We recommend to use the **relaxed layers architecture** though, which
allows any higher-level layer to couple to any layer below it.

![DDD applied to layers architecture](/img/business/layers.png)

## Dependency Inversion Principle

In the traditional view of the layers architecture, the infrastructure is at the bottom, containing technical
mechanisms like persistence, messaging or any component dependent on third-party libraries. So every upper-layer must
couple to the infrastructure layer to use the technical facilities. It is not desirable in DDD where we want to avoid
any coupling of the domain to the infrastructure. In fact we want to avoid any coupling of any layer to the 
infrastructure. To achieve this independence, we will apply the **{{< term "Dependency Inversion Principle" >}}** which
states that:

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

> Abstractions should not depend upon details. Details should depend upon abstractions.

What does it mean in terms of code, is that a low-level component should implement interfaces defined by high components.
As such, we can move the infrastructure layer to the side.

![DDD applied to layers architecture](/img/business/layers_dip.png)
 
As an example of this architecture, we would have a `JpaCustomerRepository` implementation class which would belong to
the infrastructure and which implements the `CustomerRepository` interface defined in the domain layer. When injecting
the repository elsewhere like in services, we would only use the interface. The
[dependency injection mechanism](/docs/seed/concepts/dependency-injection/) of the Java framework would provide
the correct implementation from the infrastructure.

# Interface layer

The interface layer contains the components that handle **interactions with other systems**, such as Web application
views, REST resources, Web-Services, etc...

- It handles the **interpretation**, **validation** and **translation** of the inputs.
- It handles the **serialization** of the outputs, such as JSON to Web browsers, XML to Web-Service clients, or DTO
classes and facade interfaces to remote Java clients.

# Application layer

The application layer is responsible for **driving the workflow of the application**, executing the use cases of the system.

- These operations are independent of the interfaces by which they are exposed.
- This layer is well suited for **spanning transactions**, high-level **logging** and **security**.
- The application layer is thin in terms of domain logic, it merely **coordinates the domain layer objects** to perform 
the actual work through **Application Services**.

# Domain layer

The Domain Layer is where the **business is expressed**.

- The domain is independent of the use cases of the system, but is used to achieve their realization,
- It is a very **behaviour-rich** and **expressive** model of the domain, based on entities, values objects and aggregates. 
- It contains additional blocks, such as domain services, repositories, factories, policies, etc... 

# Infrastructure layer

The infrastructure layer contains the technology-specific implementations of interfaces defined in other layers. 

- It supports all of the three other layers in different ways, facilitating communication between the layers. 
- It consists of everything that would still exist without the application: external libraries, database engine, 
application server, messaging backend and so on.
- This layer can be completely replaced by another one with other technological choices without altering the system behavior.

We often declare interfaces in **Interfaces**, **Application** and **Domain** layers and implement them in the 
infrastructure Layer. A good example is the repository: interfaces are located in the domain layer but the
implementation is in the infrastructure.







