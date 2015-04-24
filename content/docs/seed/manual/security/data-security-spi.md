---
title: "Data security SPI"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
tags:
    - "security"
    - "spi"
    - "data"
menu:
    SeedSecurity:
        weight: 60
---

> Note: This documentation is **destinated to Framework developers**.

The data security entry point is the `DataSecurityService` which takes a POJO, go through all its fields and look for annotations. If an annotation is handled by a `DataSecurityHandler`, ie. an handler implements `DataSecurity<MyAnnotation>`. It will delegate the security of this field to the corresponding handler.

# Create a DataSecurityHandler

The service will call the `securityExpression()` method which returns a security expression. This expression could be a Boolean or a String. If the expression is a String it will be evaluated as an Expression Language value and then return a Boolean.

> The expression language accepts security methods such as `hasRole()` or `hasPermission()`.

Finally if the boolean is false, ie. if the requirements are not respected, the `securityObfuscationHandler()` method is called to find the obfuscator which should be used on the candidate. Here is the `DataSecurityHandler` interface:
    
    public interface DataSecurityHandler<A> {
    	
    	/**
    	 * This methods helps to determine the security object out of the candidate.
    	 * <p>
    	 * most of the time it will be a string representing an expression language,
    	 * but it can be anything.
    	 * <p>
    	 * @param candidate the candidate object that will be provided.
    	 * @return the security expression
    	 */
    	Object securityExpression(A candidate);
    	
    	/**
    	 * This methods helps to determine the {@link DataObfuscationHandler} out of the candidate.
    	 * <p>
    	 * 
    	 * @param candidate the candidate object that will be provided.
    	 * 
    	 * @return the data obfuscation handler. the return can ben null.
    	 */
    	Class<? extends DataObfuscationHandler<?>> securityObfuscationHandler(A candidate);
    	
    }

# Sample 

We define an annotation which accepts an expression language value as security expression.
    
    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target({ ElementType.FIELD})
    public @interface MyRestriction {
    	
    	String expression();
    	
    	Todo todo() default Todo.Nothing;
    
    	public enum Todo {
    		Initial , Hide , Nothing
    	}
    }

Then, we define a `DataSecurityHandler` which handles the `@MyRestriction` annotation.

    public class MyDataSecurityHandler implements DataSecurityHandler<MyRestriction> {
    
    	@Override
    	public Object securityExpression(MyRestriction annotation) {
    		return annotation.expression();
    	}
    
    	@Override
    	public Class<? extends DataObfuscationHandler<?>> securityObfuscationHandler(MyRestriction annotation) {
    
    		if (annotation.todo() .equals( Todo.Hide  )) {
    			return Obfus.class;
    		}
    		if (annotation.todo() .equals( Todo.Initial  )) {
    			return InitialHandler.class;
    		}
    		return null;
    	}
    	
    	public static class Obfus implements DataObfuscationHandler<Integer> {
    
    		@Override
    		public Integer obfuscate(Integer data) {
                Integer result = 0;
    			if (data != null && data > 1000) {
                	result = (int) (Math.ceil(data / 1000) * 1000);
                }
    			return result;
    		}
    		
    	}
    	
    	public static class InitialHandler implements DataObfuscationHandler<String> {
    
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
    }

Then, we applicate the annotation on a POJO.
    
    public class MyUnsecuredPojo {
    	
    	private String firstname;
    	
    	@MyRestriction(expression="${1 == 2}" , todo=Todo.Initial)
    	private String name;
    	
    	@MyRestriction(expression="${ hasRole('jedi') && hasPermission('academy:learn')  }",
            todo=Todo.Hide)
    	private Integer salary;
    
    	@MyRestriction(expression="${false}")
    	private String password;
    
    	public MyUnsecuredPojo(String name, String firstname, String password , Integer salary) {
    		this.name = name;
    		this.firstname = firstname;
    		this.password = password;
    		this.salary = salary;
    		
    	}
    	
        // Getters and Setters    	
    
    }


Now, we test to secure a POJO.
	
	@Test
    @WithUser(id = "Anakin", password = "imsodark"   )
	public void test() {
		MyUnsecuredPojo pojo = new MyUnsecuredPojo("Doe", "john", "password", 12345);
		MyUnsecuredPojo pojo2 = new MyUnsecuredPojo("Doe", "jane", "password", 12345);
		
		dataSecurityService.secure(Lists.newArrayList(pojo, pojo2));

		assertThat(pojo.getName()).isEqualTo("D.");
		assertThat(pojo.getSalary()).isEqualTo(12000);
		assertThat(pojo.getPassword()).isNull();
	}
