DDD separates responsibilities (segregation) for clarity, modularity and scalability. Applying this concept leads to the definition of layers.

# Why layers ?

Organizing the project code into layers will help

- manage changes
- avoid coupling of the code
- avoid unexpected behaviours after changes
- allow better testability
- insure portability and scalability

# What layers ?

Here are the typical layers of a DDD application :

![typical layers]({business-doc}/images/layers.png)

**Rules of dependency**

- No layer is dependent of the infrastructure
- The domain is independent of the application and the interface but can be used by both.
- The application is independent of the interface but can be used by it.

# Interfaces layer

This layer holds **everything** that interacts **with other systems**, such as web applications, rest resources, RMI interfaces or web services, and batch processing frontends.

- INPUTS: It handles **interpretation**, **validation** and **translation** of incoming data.
- OUTPUT: It also handles **serialization** of outgoing data, such as JSON or XML to web browsers or web service clients, or DTO classes and distributed façade interfaces for remote Java clients.

# Application layer

The application layer is responsible for **driving the workflow of the application**, matching applicative real use cases.

- These operations are **interface-independent** and can be either **synchronous** or **message-driven**.
- This layer is well suited for **spanning transactions**, high-level **logging** and **security**.
- The application layer is thin in terms of domain logic, it merely **coordinates the domain layer objects** to perform the actual work through **Application Services**.

# Domain layer

The Domain Layer contains the place for **Domain logic**, where the **business is expressed**.

- An extremely **behaviour-rich** and **expressive** model of the domain. 
- **Domain Services**, **Repositories** and **Factories** are part of the domain. 

However, the object-relational mapper to which the repository might delegate is part of the **Infrastructure**, below this layer.

# Infrastructure layer

The Infrastructure layer deals with technology choices and focuses more on implementations rather than on intentions. 

- It supports all of the three other layers in different ways, facilitating communication between the layers. 
- It consists of everything that would still exist without the application: external libraries, database engine, application server, messaging backend and so on.

We often declare interfaces in **Application** and **Domain** Layers and implement them in the Infrastructure Layer. Good example is the Repository : interfaces are located in the Domain layer but the implementation is in the infrastructure.
