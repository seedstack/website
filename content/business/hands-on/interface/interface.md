The interfaces layer is responsible of data exposition. Its main objective is data presentation not manipulation. 
Data usually come from the domain but, can not be given to external applications directly. Interfaces layer will 
provide data in a way that will ease client consumption.

# Maven organisation

The interfaces layer is generally composed of Web interfaces so its commonly located in a maven web module. The SEED 
solution provides a maven composite to help you integrate the components needed by the interfaces layer.

```
<dependency>
    <groupId>org.seedstack</groupId>
    <artifactId>seed-web-composite</artifactId>
    <type>pom</type>
</dependency>
```

This composite brings the SEED Web support, the SEED Web security, the SEED REST support, the SEED Business web and the
SEED W20 function (see their related documentation for more information on them).

# Package organisation

The infrastructures layer is organized around use case which may not be related to a single aggregate. For instance a
"sale" use case may used an aggregate customer and an aggregate product. Use cases are composed of a resource which 
expose a representation, the representation, a finder which will load data and the assembler which will translate one
 or many aggregates into a single representation.
 
> As implementations of finders are always related to a third party library (e.g. JPA), they are located in the 
infrastructure layer.

```
org.mycompany.myapp
    - rest // interfaces layer
        - usecase1
            - UseCase1Assembler
            - UserCase1Resource
            - UseCase1Finder
            - UseCase1Representation
        - usecase2
            ...
            
    - infrastructure // infrastructure layer
        - finders
            - jpa
                - UseCase1FinderJpa
                - UseCase2FinderJpa
```