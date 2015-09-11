---
title: "Package layout"
type: "home"
zones:
    - "Business"
sections:
    - "BusinessIntroduction"
menu:
    BusinessIntroduction:
        weight: 20
---

# The domain

## Standalone domain

If you want to build a reusable domain it must be located in its own project. It is the recommended way to build a domain
because it allows to reuse it across applications and doesn't cost more than in-application domains. In that case, the
domain must be named and live in its own package, for instance:

    org.myorganization.domains.mydomain
            
Here the domain is named `mydomain`. Its prefix would naturally be adapted to your organization rules.            

## In-application domain

If you plan to place the domain inside to your application (which is not recommended), you can just code it along
your application packages. In that case it can stay without name and live as a subpackage of your project, for instance:
 
    org.myorganization.myproject.domain
    
Here the domain is not named, as it lives under the domain subpackage of the project. The project package would naturally
be adapted to your organization rules.
    
## Package organization
    
In the DDD approach, entities are grouped in sets called aggregates. Aggregates are represented as a package containing 
an aggregate root and possibly additional entities. This package also contains the factory (interface and implementation), 
the repository interface and the possible value objects or policies related to your aggregate. 
Value objects and policies which may be used by multiple aggregates should be placed in a shared package. 
Services are located in their own package. 

Implementations can be located in the `internal` subpackage if they are independent of technical aspects like a third-party 
library. Otherwise they must be located in the infrastructure. 

    org.myorganization.domains.mydomain (can also be org.myorganization.myproject.domain for in-application domain)
        - model
            - myaggregate1
                - MyAggregateRoot
                - MyEntity1
                - MyEntity2
                - MyAggregateFactory
                - MyValueObject
                - MyRepository
                - MyPolicy
                - internal
                    - MyPolicyImpl
                    - MyAggregateFactoryImpl
            - myaggregate2
                ...
                
        - services
            - MyService1
            - MyService2
            - internal
                - MyService1Impl
                
        - shared
            - MySharedValueObject
            - MySharedPolicy1
            - internal
                - MySharedPolicy1Impl
            

{{% callout warn %}}
The domain should never depends on specific technical aspects. As such no infrastructure package have a place in a reusable
domain. The infrastructure for the domain should reside in the client of the domain (the application using the domain) as
it is specific to it (a same domain can be persisted very differently in different applications).
{{% /callout %}}
    
# The application 

The application layer contains application services which should be located in the application package. Implementations
can be in `internal` subpackages if they are independent of technical aspects (third-party library). Otherwise, they must 
be located in the infrastructure package.

    org.myorganization.myproject
        - application
            - services
                - MyService3
                - MyService4
                - internal
                    - MyService3Impl
                
        - infrastructure
            - services
                - 3rdparty-lib
                    - MyService4Lib 
            - repositories
                - jpa
                    - MyRepositoryJpa

{{% callout info %}}
Note that the infrastructure also contains the implementation of domain concepts related to a specific technology, such
as implementations of repositories or of some services.
{{% /callout %}}

# The interfaces

    org.myorganization.myproject
        - rest
            - usecase1
                - UseCase1Assembler
                - UserCase1Resource
                - UseCase1Finder
                - UseCase1Representation
            - usecase2
                ...
                
        - infrastructure
            - finders
                - jpa
                    - UseCase1FinderJpa
                    - UseCase2FinderJpa

