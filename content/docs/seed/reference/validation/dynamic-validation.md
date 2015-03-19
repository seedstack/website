---
title: "Dynamic validation"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedValidation"
tags:    
    - "validation"
    - "example"
    - "api"
menu:
    SeedValidation:
        weight: 30
---

Bean Validation 1.1 introduces Dynamic Validation, also called "Design by Contract". You can now let SEED validate inputs and outputs 
of your services by simply providing constraint annotations on parameters and/or on methods' return types.

For example, consider below code:

    public void sendEmail(@Email String email, @Valid Message message) {
        // Real code after that
        ...
    }

`@Email` validation guarantees by design that the email parameter will be valid when used in `sendEmail` method.
In the same way, `@Valid` garantees that the message will be valid.

# Validation on method execution
## On method return

    import javax.validation.constraints.NotNull;
    
    public class DummyServiceParamReturnType  {
	
    	@NotNull 
    	public Object doSomethingAweswome (Object param)
    	{
		    Object toReturn = null;
            ...
            return toReturn; 
	    }
    }

## On method parameters
    import javax.validation.constraints.NotNull;

    public class DummyServiceParamValidation  {
	
	    public void doSomethingAweswome (@NotNull Object param)
	    {
		    /// do something
	    }
    }

## When using your services


    @Inject
	DummyServiceParamReturnType serviceReturnType;

    @Inject
	DummyServiceParamValidation serviceParam;


SEED provides a proxy which handles input parameters and return value verification throwing a
`org.seedstack.seed.validation.internal.ValidationException` upon any constraint violation.
