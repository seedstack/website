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

The goal of the security on data is to protect the data exposed by an application. It will take data representations 
and obfuscate them when the user is not allowed to see them according to its roles and permissions.

> For instance, an account number `79927391338710` could be transformed into `799273****8710`.

The security on data can be applied by using the `DataSecurityService` as follows:

    @Inject
    private DataSecurityService dataSecurityService;

    dataSecurityService.secure(myDto);

This service will go recursively through the object fields and look restrictions:
 
* When a field is annotated with a restriction (an annotation for which a `DataSecurityHandler` exists), it will delegate 
the security of this field to the corresponding handler. 
* The handler provides a security expression that is evaluated against the current user. If the security expression
evaluates to true, the field is left untouched but if it evaluates to false, the field is obfuscated.
* The handler also provides a `DataObfuscationHandler` handler class to which the obfuscation will be delegated to. 
By default if no obfuscation handler is given the field will be set to null.

# Security expressions

Security expressions provided by a `DataSecurityHandler` can be of boolean or String type. When they are of String type, 
they will be evaluated as Expression Language (EL). The security expressions can use the following methods:


    /**
     * Checks the current user role.
     *
     * @param role the role to check
     * @return true if user has the given role
     */
    public static boolean hasRole(String role);

    /**
     * Checks if the current user has at least one of the given roles.
     *
     * @param roles the list of role to check
     * @return true if user has the one of the given roles
     */
    public static boolean hasOneRole(String... roles);

    /**
     * Checks the current user roles.
     *
     * @param roles the list of role to check
     * @return true if user has all the given roles
     */
    public static boolean hasAllRoles(String... roles);

    /**
     * Checks the current user role in the given domains.
     *
     * @param role    the role to check
     * @param domains the list of domains
     * @return true if the user has the role for all the given domains.
     */
    public static boolean hasRole(String role, String... domains);

    /**
     * Checks the current user permission.
     *
     * @param permission the permission to check
     * @return true if user has the given permission
     */
    public static boolean hasPermission(String permission);

    /**
     * Checks if the current user has at least one of the given permissions.
     *
     * @param permissions the list of permission to check
     * @return true if user has at least one of the permissions
     */
    public static boolean hasOnePermission(String... permissions);

    /**
     * Checks the current user permissions.
     *
     * @param permissions the list of permission to check
     * @return true if user has all the given permissions
     */
    public static boolean hasAllPermissions(String... permissions);

    /**
     * Checks the current user permission.
     *
     * @param permission the permission to check
     * @return true if user has the given permission
     */
    public static boolean hasPermission(String permission, String... domains);

These methods are usable as follows:

    "${ ! hasRole('jedi') && hasPermission('academy:learn') }"
    "${hasAllPermissions('lightSaber:*', 'academy:*')}"
    "${hasPermission('lightSaber:*', 'MU')}"

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

# DataSecurityHandler

To define a `DataSecurityHandler`, you can reuse an annotation or define your own:
    
    @Documented
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

Then, apply the annotation(s) on a POJO:
    
    public class MyPojo {    	
    	private String firstName;
    	
    	@MyRestriction(expression="${1 == 2}" , todo=Todo.Hide)
    	private String name;
    	
    	@MyRestriction(
    		expression="${ hasRole('jedi') && hasPermission('academy:learn')  }", 
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

You can now test to secure a POJO.
	
	@Test
    @WithUser(id = "Anakin", password = "imsodark"   )
	public void test() {
		MyPojo pojo = new MyPojo("Doe", "John", "password", 12345);
		
		dataSecurityService.secure(pojo);

		assertThat(pojo.getName()).isEqualTo("D.");
		assertThat(pojo.getFirstName()).isEqualTo("John");
		assertThat(pojo.getPassword()).isNull();
		assertThat(pojo.getSalary()).isEqualTo(12000);
	}



