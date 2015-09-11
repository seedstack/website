---
title: "Data security"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
tags:
    - "expression-language"
    - "security"
    - "data"
    - "api"
menu:
    SeedSecurity:
        weight: 50
---

The goal of the security on data is to protect the data exposed by an application. It has the ability to obfuscate any attribute of any object that does not pass the security restriction defined on it. For instance, an account number `79927391338710` can be transformed into `799273******10`.

# Usage

## @Restriction annotation

This annotation can be applied on any class attribute. The field value will be obfuscated when data security will be applied:

    public class MySecuredPojo {
        @Restriction(value = "${ hasRole('manager') }", obfuscation = AccountObfuscationHandler.class)
        private String accountNumber;
        
        ...
    }

The value of the annotation is a security expression (see [this section](#security-expressions) for more details). If it evaluates to false against the current Subject the field will be obfuscated according to the `DataObfuscationHandler` specified (see [this section](#dataobfuscationhandler) for more details). The default obfuscation handler nullifies the field.

## Data security service

The security on data can be applied by using the `DataSecurityService` as follows:

    @Inject
    private DataSecurityService dataSecurityService;

    dataSecurityService.secure(myDto);

This service will go recursively through the object fields and look for restrictions. Each restriction that evaluates to false against the current Subject will trigger the obfuscation of its associated field.

## @Secured annotation

You can add a `@Secured` annotation on any method parameter to automatically apply data security on it. You can also apply the `@Secured` annotation directly on the method to apply data security on the return value:

    @Secured
    public SecuredPojo1 securedMethod(@Secured SecuredPojo2 securedPojo2) {
        ...
    }

Every method annotated with `@Secured` or with the annotation applied to at least one of its parameters will be intercepted and the relevant objects will be secured. Note that the [usual interception limitations](/docs/seed/concepts/dependency-injection/#method-interception) apply.

{{% callout warning %}}
Please note that the data security interceptor will inspect the whole object graph starting from the secured object, so you may encounter some performance penalty depending on its size. It shouldn't be a problem 
for typical use.
{{% /callout %}}

# Security expressions

Security expressions are strings that respect the [Unified Expression Language (UEL)](https://uel.java.net/) syntax. The following methods are available:

* `hasRole(String role)`. Returns true if the current subject has the specified role, false otherwise.
* `hasOneRole(String... roles)`. Returns true if the current subject has at least one of the specified roles, false otherwise.
* `hasAllRoles(String... roles)`. Returns true if the current subject has all the specified roles, false otherwise.
* `hasRole(String role, String... scopes)`. Returns true if the current subject has the specified role for all the specified scopes, false otherwise.
* `hasPermission(String permission)`. Returns true if the current subject has the specified permission, false otherwise.
* `hasOnePermission(String... permissions)`. Returns true if the current subject has at least one of the specified permissions, false otherwise.
* `hasAllPermissions(String... permissions)`. Returns true if the current subject has all the specified permissions, false otherwise.
* `hasPermission(String permission, String... scopes)`. Returns true if the current subject has the specified permission on the specified scopes, false otherwise.

Examples:

```plain
${ !hasRole('manager') && hasPermission('salary:view') }
${ hasAllPermissions('salary:view', 'salary:update') }
${ hasPermission('users:manage', 'FR') }
```

More resources on EL:

* [Oracle tutorial](http://docs.oracle.com/javaee/6/tutorial/doc/gjddd.html)
* [Unified Expression Language](https://uel.java.net/)

# DataObfuscationHandler

The goal of a `DataObfuscationHandler` is to obfuscate data with a specific algorithm.
For instance, it could take a name, eg. "Doe" and return an anonymised name "D.". This would be implemented as follows:

    /*
     * This {@code DataObfuscationHandler} takes a {@code String}, eg. "Doe" and
     * obfuscate it into "D.".
     */
    public static class NameObfuscationHandler implements DataObfuscationHandler<String> {
		@Override
		public String obfuscate(String data) {
			String result = "";
			if (data != null && data.length() > 0) {
				result = data.charAt(0) + ".";
                result = result.toUpperCase();
			}
			return result;
		}
	}

# Custom annotations

Custom restriction annotations can be defined and registered with data security by defining a `DataSecurityHandler`. Start with defining a custom annotation:
    
    @Retention(RetentionPolicy.RUNTIME)
    @Target({ ElementType.FIELD})
    public @interface MyRestriction {
    	
    	String expression();
    	
    	Todo todo() default Todo.Nullify;
    
    	public enum Todo {
    		Hide, Round, Nullify
    	}
    	
    }

Then, define a `DataSecurityHandler` which handles the `@MyRestriction` annotation.

    public class MyDataSecurityHandler implements DataSecurityHandler<MyRestriction> {
    
    	@Override
    	public Object securityExpression(MyRestriction annotation) {
    		return annotation.expression();
    	}
    
    	@Override
    	public Class<? extends DataObfuscationHandler<?>> securityObfuscationHandler(
    																MyRestriction annotation) {    
    		if (annotation.todo() .equals( Todo.Round  )) {
    			// Uses the rounding obfuscation handler defined below
    			return RoundingObfuscationHandler.class;
    		}
    		
    		if (annotation.todo() .equals( Todo.Hide  )) {
    			// Uses the name obfuscation handler defined in the previous section
    			return NameObfuscationHandler.class;
    		}
    		
    		return null;
    	}
    	
    	public static class RoundingObfuscationHandler 
    						implements DataObfuscationHandler<Integer> {
    
    		@Override
    		public Integer obfuscate(Integer data) {
                Integer result = 0;
    			if (data != null) {
                	result = (int) (Math.ceil(data / 1000) * 1000);
                }
    			return result;
    		}    		
    	}
    }

Then, you can apply the annotation on a POJO:
    
    public class MyPojo {    	
    
    	private String firstName;
    	
    	@MyRestriction(expression="${1 == 2}" , todo = Todo.Hide)
    	private String name;
    	
    	@MyRestriction(
    		expression="${ hasRole('manager') }", 
    		todo=Todo.Round
    	)
    	private Integer salary;
    
    	@MyRestriction(expression="${false}")
    	private String password;
    
    	public MyPojo(String name, String firstName, String password, Integer salary) {
    		this.name = name;
    		this.firstName = firstName;
    		this.password = password;
    		this.salary = salary;
    	}
    	
        ...    	
    }
