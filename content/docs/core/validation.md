---
title: "Validation"
type: "home"
zones:
    - "Docs"
tags:
    - validation
menu:
    docs:
        weight: 7
        parent: "core"
---

SeedStack provides built-in support for Bean Validation 1.1 (JSR 303 & JSR 349) in the core module. This is a part of
the core, including the Hibernate Validator implementation which is automatically provided. <!--more-->

The following features are provided:

* On-demand POJO validation,
* Automatic validation of method parameters and return values (through interception),
* Dependency injection inside custom validator,
* Validation errors message interpolation using EL if present, with fallback to standard parameter resolver.

{{% callout info %}}
Validation can also happen at various stages of an object lifecycle, depending on the other SeedStack modules integrated
in a project. For instance, persistence add-ons often support automatic validation of objects before persisting them.
These additional validations will use the same validation behavior as the one described here.  
{{% /callout %}}

## Usage

### On-demand

On-demand validation is done by injecting the standard {{< java "javax.validation.Validator" >}} interface:

```java
public class SomeClass {
    @Inject
    private Validator validator;
    
    public void someMethod(SomePojo somePojo) {
        Set<ConstraintViolation<SomePojo>> violations = validator.validate(somePojo);
        // Inspect constraint violations
    }
}
```

{{% callout tips %}}
For more advanced use cases the {{< java "javax.validation.ValidatorFactory" >}} interface can also be injected. It allows
to control the {{< java "javax.validation.Validator" >}} creation process.
{{% /callout %}}

## Method parameters and return values

Method parameters and return values can be automatically validated by applying constraint annotations on them
({{< java "javax.validation.constraints.NotNull" >}}, {{< java "javax.validation.Valid" >}}, ...). These annotations 
are automatically detected by SeedStack and interception will be enabled on the method to enforce them.

```java
public class SomeClass {
    @NotNull
    public SomePojo someMethod(@Valid OtherPojo param) {
        // At this point, param is guaranteed to be valid
        return new SomePojo();
        // The return value will be validated before being handed-over to the caller
    }
}
```

A {{< java "javax.validation.ConstraintViolationException" >}} will be thrown on method call if at least a constraint
is violated. 

{{% callout warning %}}
Beware of SeedStack [method interception limitations]({{< ref "docs/basics/dependency-injection.md#method-interception" >}}) 
when using parameters and return values constraints.  
{{% /callout %}} 

## Custom validators

Custom validators can be defined in two steps: 

* First creating an annotation representing the constraint, 
* Then creating its validator implementation.

### Constraint annotation

To create a constraint annotation, create an annotation, itself annotated with {{< java "javax.validation.Constraint" "@" >}}
referencing the custom validator implementation:

```java
@Target({FIELD, METHOD, PARAMETER, ANNOTATION_TYPE})
@Retention(RUNTIME)
@Constraint(validatedBy = CheckCaseValidator.class)
@Documented
public @interface CheckCase {

    // Required by specification
    String message() default "{org.some.app.message}";

    // Required by specification
    Class<?>[] groups() default {};

    // Required by specification
    Class<? extends Payload>[] payload() default {};

    CaseMode value();

    // Required by specification to allow specifying 
    // multiple annotations on the same element
    @Target({FIELD, METHOD, PARAMETER, ANNOTATION_TYPE})
    @Retention(RUNTIME)
    @Documented
    @interface List {
        CheckCase[] value();
    }
}
```

The related `CaseMode` enum is:

```java
public enum CaseMode {
    UPPER,
    LOWER;
}
```
  

### Validator implementation

To create the validator implementation, implement the {{< java "javax.validation.ConstraintValidator" >}} interface:

```java
public class CheckCaseValidator implements ConstraintValidator<CheckCase, String> {
    private CaseMode caseMode;

    @Override
    public void initialize(CheckCase constraintAnnotation) {
        this.caseMode = constraintAnnotation.value();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintContext) {
        if (value == null) {
            return true;
        } else if (caseMode == CaseMode.UPPER) {
            return value.equals(value.toUpperCase());
        } else {
            return value.equals(value.toLowerCase());
        }
    }
}
```

{{% callout tips %}}
Validator implementations can be [injected]({{< ref "docs/basics/dependency-injection.md" >}}) to allow for 
sophisticated validation behavior. 

For instance, you can access persistence, use business services or even check security conditions in a custom validator. 
{{% /callout %}}

