---
title: "Qualified injection"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessCore"
menu:
    BusinessCore:
        weight: 20
---

The SEED Business framework supports the use of qualifiers defined by the JSR 330. This feature provides the ability to 
create multiple implementations for the same interface. This is useful when you have multiple algorithms or implementation
technologies for an interface.

# An example with policies

This pattern can be used in various situations but proves itself very useful in the case of DDD policies. To leverage it,
define a Policy interface as follows:

    package org.mycompany.domains.mydomain.shared;

    @Policy
    public interface TaxesPolicy {
    
        Integer computeTaxes(Order order);
    
    }
    
Then define an implementation annotated by a qualifier. The annotation `@Named` allows to qualify an implementation with
a String.
    
    package org.mycompany.domains.mydomain.shared.internal;
    
    @Named("France")
    public class FranceTaxesPolicy implements TaxesService {
    
        Integer computeTaxes(Order order){
            ...
        }
    
    }

Finally you can inject it as follows:

    @Inject @Named("France")
    private TaxesPolicy frenchService;
    
    @Inject @Named("UK")
    private TaxesPolicy ukService;

# Use a custom qualifier

If a qualifier is often used, you can create a custom qualifier annotation as follows.

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

Then you use it like the `@Named` annotation.
   
    @Inject @France
    private TaxesService taxesService;

# List of concepts supporting qualifiers

Qualified injection can be used on these concepts out-of-the-box:

* Assembler,
* Repository,
* Factory,
* Policy,
* Service,
* Finder.
