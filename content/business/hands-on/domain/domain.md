This section describes the SEED Business Framework Domain building blocks and how to use them effectively to build your 
own domain. It also covers additional topics around the domain, like events or identity generators, to help you easily 
implement the domain behavior.

# Maven organisation

The domain is generally contained in your app module which also contains the application layer. But sometimes you may
want to reuse your domain over multiple application. In this case, the domain should be in its own module. The SEED 
solution provides the following composite to help you create a domain. 

    <dependency>
        <groupId>org.seedstack</groupId>
        <artifactId>seed-domain-composite</artifactId>
        <type>pom</type>
    </dependency>

This composite brings the SEED Business core, the validation support, and the SEED Business JPA.

# Package organisation

We have seen in the [DDD concepts](#!/business-doc/understanding-ddd/domain-layer) that a domain is organized around 
aggregates. How this renders in your project ? An aggregate is represented as a package containing an aggregate root
and possibly some entities. This package also contains the factory (interface and implementation), the repository
interface and the possible value objects or policies related to your aggregate. Value object and policy which may be 
used by multiple aggregates should be placed in a shared package. Services are located in their own package. The services
implementations may be also located in the service package if they are not related to a third party library. In this 
case they will located in the infrastructure layer. This is the same for repository implementation. 

> The domain layer should never depends on third party library. All specific implementations should be located in the
infrastructure layer.

Here is a sample of domain organisation:

```
org.mycompany.myapp
    - domain // domain layer
        - model
            - myaggregate1
                - MyAggregateRoot
                - MyEntity1
                - MyEntity2
                - MyAggregateFactory
                - MyAggregateFactoryImpl
                - MyAggregateRepository // Now optional (see default repository)
                - MyValueObject
                - MyPolicy
                - internal
                    - MyPolicyImpl
            - myaggregate2
                ...
        - services
            - MyDomainServices1
            - MyDomainServices2
            - internal
                - MyDomainServices2Impl
        - shared
            - MySharedValueObject
            - SharedPolicy
            - internal
                - SharedPolicyImpl
    
    - infrastructure // infrastructure layer
        - service
            - 3rdparty-lib
                - MyDomainServices1Lib1 // implementation of MyDomainServices1
        - persistence
            - jpa
                - MyAggregateJpaRepository
```