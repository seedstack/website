---
title: "Using multiple implementations"
type: "reference"
zones:
    - "Business"
sections:
    - "BusinessApplicationLayer"
menu:
    BusinessApplicationLayer:
        weight: 30
---

The SEED Business framework supports the use of qualifiers defined by the JSR 330. This feature provides the ability to 
create multiple implementations for the same interface. This is useful when you have multiple algorithms or infrastructures
for an interface.

# Inject qualified services

Define an interface as usual:

    package org.mycompany.myapp.application.services;

    @ApplicationService
    public interface TaxesService {
    
        Integer computeTaxes(Order order);
    
    }
    
Then define an implementation annotated by a qualifier. The annotation `@Named` allows to qualify an implementation with
a String.
    
    package org.mycompany.myapp.application.services.impl;
    
    @Named("France")
    public class TaxesServiceImpl implements TaxesService {
    
        Integer computeTaxes(Order order){
            ...
        }
    
    }

Finally you can inject it as follows:

    @Inject @Named("France")
    private TaxesService frenchService;
    
    @Inject @Named("UK")
    private TaxesService ukService;

# Use a custom qualifier

If a qualifier is often used, you can create a custom qualifier annotation as follows.

```
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;
 
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
 
import javax.inject.Qualifier;
 
@Qualifier
@Target({ TYPE, METHOD, FIELD })
@Retention(RUNTIME)
public @interface France {
}
```

Then you use it like the `@Named` annotation.
   
```
@Inject @France
private TaxesService taxesService;
```

# List of interface supporting qualifiers

* repository
* factory
* policy
* domain service
* application service
* interface service
* finder
