This section describes the building blocks used to build the application layer.

# Maven organisation

The application layer is located in the maven app module. The SEED solution provides a maven composite to help you integrate
the components needed by the application layer.

    <dependency>
        <groupId>org.seedstack</groupId>
        <artifactId>seed-app-composite</artifactId>
        <type>pom</type>
    </dependency>
    
This composite brings the SEED Business core, the validation support, the SEED Business JPA, the security support, and 
the shell support (see related [documentations](#!/seed-doc) for more information).

# Package organisation

The application layer contains application services which should be located in the application package. There implementations
can be in an application.internal package if they are not related to a third party library. Otherwise, they must be
located in the infrastructure layer.

```
org.mycompany.myapp
    - application // application layer
        - service
            - MyApplicationService1
            - MyApplicationService2
            - internal
                - MyApplicationService2Impl
            
    - infrastructure // infrastructure layer
        - service
            - 3rdparty-lib
                - MyApplicationService1Lib1 // implementation of MyApplicationService1 
```