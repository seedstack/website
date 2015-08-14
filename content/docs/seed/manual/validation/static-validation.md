---
title: "Static validation"
type: "manual"
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
        weight: 20
---

Static Validation consists in constraint annotations applied to a field or its "getter" on any POJO:

    public class SeedManagedPojo {
	    @Range(min = 0, max = 200)
    	private int age;

    	@NotNull
    	@Range(min = 10L, max = 999999999999999999L)
    	private Long longNumber;
    
    	@NotNull(message = "Name is mandatory")
    	@Size(min = 1, max = 10)
    	private String name;

        @Valid // validation on cascade
        private Pojo pojo;

        ...
    }

# Validation of injection

When injecting a POJO, Seed raises a `org.seedstack.seed.validation.ValidationException` if constraint annotations are not respected.
     
     @Inject
     SeedManagedPojo seedPojo;
     ...

Beware that an invalid POJO injected at application startup will prevent it from starting. You'll have to check your logs.

# Validation on demand

A POJO instance can be validated at any time through Seed `ValidationService`:

	import org.seedstack.seed.validation.ValidationService;
    ...
    @Inject
	ValidationService validationService; 


Consider the below `Pojo` Class:

	public class Pojo
	{
		
		@Size(min=4)
		private String name;
		
		public Pojo(String name)
		{
			this.name = name;
		}
		
		public String getName ()
		{
			return this.name;
		}
	}


You can ask for a static validation using following code:

		try {
			validationService.staticallyHandle(new Pojo("epo")); // "epo" has a 3 length
		}
		catch(ValidationException validationException)
		{
			// will display detail error
            validationException.printStackTrace(); 

            // you can reach the standards constraints violation
            Set<ConstraintViolation<?>> constraintViolations 
			   = validationException.get(ValidationService.JAVAX_VALIDATION_CONSTRAINT_VIOLATIONS);
		}

If a validation error occurs, a ValidationException will be thrown:

    org.seedstack.seed.validation.internal.ValidationException
	-------------------------------
	VALIDATION_ISSUE : org.seedstack.seed.validation.internal.ValidationErrorCode
	0 - Path=[class org.seedstack.seed.validation.internal.ValidationServiceIT$Pojo.name]
	0 - size must be between 4 and 2147483647=[epo]
	Set<javax.validation.ConstraintViolation>=[[ConstraintViolationImpl{interpolatedMessage='size must be between 4 and 2147483647', \
    propertyPath=name, \ 
    rootBeanClass=class org.myorganization.myproject.Pojo.name, \
    messageTemplate='{javax.validation.constraints.Size.message}'}]]
	-------------------------------
