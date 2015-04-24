---
title: "Overview"
type: "manual"
zones:
    - "Business"
sections:
    - "BusinessDataSecurity"
menu:
    BusinessDataSecurity:
        weight: 10
---

The security is often all or nothing; if you have a certain permission then, you have access to this method/REST resource/page. 
But it happens that users with different roles or permissions should have access to the same method but not the same data. 
For instance, in list of user an admin will see "John Doe" and others will see "John D.". In this case, SEED
Business framework provides a mechanism to **obfuscate data according to the roles or the permissions** of the connected user.

# Make you assemblers secured

You can add a `@Secured` annotation on your assembler methods to secure assembled data. To secure the outputted representation,
add the annotation like in the following code:

    @Override
    protected void doMergeAggregateWithDto(MyAggregate targetAggregate, @Secured MyDto sourceDto) {
        (...)
    }

To secure the source representation before merging it with the aggregate:

    @Override
    protected void doAssembleDtoFromAggregate(@Secured MyDto targetDto, MyAggregate sourceAggregate) {
        (...)
    }

{{% callout warning %}}
Please note that the data security interceptor will inspect the whole object graph starting from the representation,
so there will be some performance penalty depending on its size. It shouldn't be a problem for typical DTO/representation
size.
{{% /callout %}}

# Secured Representations/DTOs with @Restriction

Now, we have to indicate what and how to secure the data we want to expose. Below an EmployeeRepresentation.


```
public class EmployeeRepresentation {
	
	@Restriction(value = "${false}" , obfuscation=EmployeeNameObfuscation.class )
	private String name;
	
	@Restriction("${ hasRole('jedi') && hasPermission('academy:learn')  }")
	private Long salary;
	
	
	@Restriction("${ hasRole('jedi') && hasPermission('academy:learn')  }")
	private Boolean manager;
	
	
	@Restriction
	private String comment;
	
    - - - 8< getters/setters - - -
}
```

With your fields annotated with `@Restriction` your representation
will be filtered according to your roles and permissions by the
secured assemblers. Under the hood secured assemblers is using the
`DataSecurityService` from security support.

# @Restriction detailled usage

Restriction annotation take two parameters two are optionnal with default values:

 - **value** : is a String and is the **security expression** of this
   fields. SEED supports the expression language via the el-support so
   you have to enter a string supporting this standard. The el have to be a `Boolean`.
   - default for **value** is `${false}`. Which basicaly means this fields will never be shown. 
   - To express **permissions** and **roles** in your security
     expression (like hasRole or hasPermission), please refer to
     [Data Security API/Expression Language](/#!/seed-doc/security/data-security-api#expression-language)
 - **obfuscation** : When the security expression returns false, you
   have to decide what to do with the value of the field. Security API
   has defined an interface to do the job. This is the
   `DataObfuscationHandler<?>` which have only one method : `Object obfuscate(Object input)`. Please check [Data Obfuscation](/#!/seed-doc/security/data-obfuscation)
   - default for **obfuscation** is `InstanceCleaner` an
     ObfuscateHandler define in the Business Framework which emptyfy
     the object, ie. strings become "", int -> 0, etc.
   - You can create your own `DataObfuscationHandler<?>` to reflect
     your own obfuscation rules. You can imagine hide salary, hide
     payment card number and so on.

# Obfuscate without Secured assemblers

If you are not using assemblers to create your DTO, you always have 2 ways to secured your exposed data.

## @Secured annotation 

Considering the application service EmployeeService 

    @ApplicationService
    public interface EmployeeService {
    	
    	@Secured
    	EmployeeDto service1( @Secured EmployeeDto d1 , EmployeeDto d2 ,
                               EmployeeDto d3 ) ;
    	
    	EmployeeDto service2( EmployeeDto d4 ) ;
    
    }

and its implementation EmployeeServiceInternal 

    public class EmployeeServiceInternal implements EmployeeService {
    
    	@Override
    	public EmployeeDto service1(EmployeeDto d1, @Secured EmployeeDto d2,
                                    EmployeeDto d3) {
            ...
    		return myEmployeeDto;
    	}
    
    	@Override
    	public Employee service2(EmployeeDto d4) {
            ... 
    	    return myEmployeeDto;
    	}
    
    }

The following will be obfuscated :

 - the returned `EmployeeDto` of service1().
 - the first parameter of service1() `d1` will be secured **after** the execution. Via the interface.
 - the second parameter of service1() `d2` will be secured **after** the execution. Via the implementation.

If `EmployeeDto` has some `Restriction`  annotation on its fields, it will be obfuscated according to the value of the security expression.

## DataSecurityService 

You can also, anywhere in your interfaces layer or application layer
use the `DataSecurityService` on you DTOs or Representation as
described in the [Data Security API](/#!/seed-doc/security/data-security-api).