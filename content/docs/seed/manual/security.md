---
title: "Security"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedManual"
menu:
    SeedManual:
        weight: 30
---

Seed provides application security through a powerful security model, which is equally easy to configure and to enforce.
It takes charge of the following tasks:

* Identification (provides the identity of a subject),
* Authentication (verifies the subject identity),
* Authorization (defines which roles and permissions a subject can have),
* Access-control (enforces access restrictions to entry-points and/or to any arbitrary code). 

To enable security to your project, you need to add the `seed-security-core` module. {{< dependency g="org.seedstack.seed" a="seed-security-core" >}}
    
In a Web application, you may want to enable HTTP-based security by adding the `seed-web-security` module. {{< dependency g="org.seedstack.seed" a="seed-web-security" >}}
    
{{% callout info %}}
The internal security engine is [Apache Shiro](http://shiro.apache.org/). Seed provides additional benefits on top of Shiro
such as:

* Easy, unified configuration.
* Built-in security realms such as LDAP, X509 certificate or configuration-based.
* A plugin mechanism to dynamically register additional entry point security.
* Security scopes which restrict roles and permissions to specified scopes, like a geographical area.
* Data security which can nullify or obfuscate object attributes based on subject authorizations.
{{% /callout %}}

# Definitions

## Subject

A *subject* is defined as any entity that request access to an *object*. For instance, subject are often end-users which
request to access a specific resource through a User-Interface. But subjects can really be anything like a remote computer
or a local program.  

## Principal

A *principal* is a defining characteristic of a subject that can be uniquely identified, like an identifier, a name,
a social-security number, a language, etc...
 
## User

A *user* is a specific kind of subject that is defined by principals usually referring to a human operator, like a name
or a user-identifier.

## Identification

Identification is the process of uniquely tracking a subject across its interactions with the system. 

## Authentication

Authentication is the process of verifying the subject identity by validating a proof of identity. This is usually done 
by submitting a principal identifying the subject (like a user-identifier) and a proof of identity that the system 
understands and trusts, such as a password, a certificate or any other mean. 

## Authorization

Authorization is the process of determining an access policy for a subject. This is done by compiling all granted rights
into an access policy.

## Access control

Access control is the process of verifying the authorizations of a subject relative to an object. It enforces the policy
that is used to determine *who* has access to *what*.

# Model

Seed provides a security meta-model that is easy to understand yet powerful enough for the most complex applications. This
meta-model revolves around three main concepts: permissions, roles and subject. It allows to define a fine-grained and
modular security policy.

## Permissions

Permissions are the most atomic elements of a security policy. They describe concrete actions and represent what can
be done in an application. A well-formed permission statement describes one or more resource(s) and what actions are
possible when a subject interacts with those resources. Consider the following examples of permissions:

* Open a file,
* Print a document,
* Access the `/products` Web resource,
* Delete an order.

CRUD actions can frequently be found in permissions but any meaningful verb can be used. The fundamental idea is that
a permission should combine a resource description with an action description.

{{% callout info %}}
Permission statements reflect behavior (actions associated with resource types) only. They do **not** reflect who is able to 
perform such behavior. Defining who (which subject) can do what (which permission) is done by assigning permission to 
subjects.
{{% /callout %}}

### Simple usage

The simplest expression of a permission is a single term String:
  
    printDocument
    deleteDocument
    viewDocument
    
These permissions represent the ability to `print`, `delete` or `view` a document. This very basic form of permission requires
to be granted one-by-one or with a `*` wildcard, which will grant all the permissions of the application. This may work
in the simplest applications but it is not recommended. The *multi-level* permissions should be preferred.

### Multi-level

Instead of expressing the permission as a single term, a multi-level permission can be used:

    document:print
    document:delete
    document:view
    
The colon (`:`) is a special character that is used to delimit the different parts of a multi-level permission. There
are no enforced requirements on how a multi-level permission should be organized, but it is recommended to go from the most
general to the most specific, from left to right. Also, there is no limit to the number of parts.

### Multiple values

Each part can contain multiple values, separated by commas (`,`):

    document:print,view
    
When assigning this permission to a subject, this grants the ability to `print` and `view` documents.

### All values

To grant all permissions of a specific level, use the `*` wildcard character:

    document:*
    *:view
    
The first permission, when assigned to a subject, allow to do any action on documents (meaning that any permission check
of the `document:XXX` pattern will be granted). The second permission grants the view action on all application resources
(meaning that any permission check of the `XXX:view` pattern will be granted).

### Instance-level checks

The identifier of a specific instance can be used at the end of a permission:

    document:print:doc273

This permission allows to print the document identified by the `doc273` identifier. 

### Missing parts

Missing parts in permissions imply that the user has access to all values corresponding to that part:

    printer:print
    
This permission is equivalent to:
    
    printer:print:*
    
Note that you can only leave off parts from the *end* of the permission.

## Roles

A Role is a named entity that typically represents a set of behaviors or responsibilities. Those behaviors translate to 
things you can or can't do with an application. Roles are typically assigned to subject like user accounts, so by 
association, subjects can *do* the things attributed to various roles. There are two kinds of roles that can be used:

* **Implicit roles**: nothing is explicitly expressed in the application to assign permissions to implicit roles. The 
allowed behavior is implicitly derived from the role name only. For instance the `admin` role can do any administration
task and those administration task are protected by a checking if the subject has the `admin` role. This kind of role, 
while superficially simpler, is **strongly discouraged**. Adding, removing or redefining such roles later in the life of
an application will be difficult, costly and may lead to holes in the security model.
* **Explicit roles**: they are expressed as a named collection of actual permissions. In this form, the allowed behavior
is explicitly defined and the code only contains specific permission checks which directly relates to the code behavior.
Altering the security model later in the life of an application will be easy and won't require to change existing code 
with the potential security implications. This kind of role, is **recommended**. 

## Subjects

Subjects represent the entity which executes actions on the application. The most common type of subject is the `User`
type, which represents a human operator interacting with the application. Subjects are allowed to perform certain actions 
in your application through their association with roles or direct permissions. Assigning roles and permissions to subjects
is done through a `Realm` implementation.

## Realms

A realm implementation role is to translate a specific data-model, like an LDAP directory or a set of database tables, 
into a security policy expressed with the security meta-model described above. Seed provides several predefined realms:

* The `ConfigurationRealm` which computes the security policy from specific properties in the application configuration.
* The `X509CertificateRealm` which computes the security policy from an X509 certificate.
* The `LdapRealm` which computes the security policy from requests to a configured LDAP directory. This realm is available
in the [LDAP add-on](/addons/ldap).

{{% callout info %}}
Custom realms can be implemented to compute any data-model into an enforceable security policy.
{{% /callout %}}

# Configuration

Beyond defining the security model of the application, the security infrastructure must be configured.

## Realm configuration

A Realm is a component that can access specific security data such as users, roles, and permissions. The Realm translates 
this specific data into a format that is understood by the security engine. There is usually a 1-to-1 relation between
a realm and a datasource, such as an LDAP directory, a set of relational tables or configuration properties.
 
{{% callout info %}}
Most of the security datasources usually store both authentication and authorization data, so a realm can perform both 
the authentication and authorization tasks.
{{% /callout %}}

To specify the realm(s) to enable, use the following configuration property:

```ini
org.seedstack.seed.security.realms = list of realms to use
```
    
The realm name correspond to the simple name of the Java class that implements the realm. For instance to enable the
LDAP realm (which is implemented in the {{< java "org.seedstack.ldap.internal.realms.LDAPRealm" >}} Java class), use 
the following configuration:

```ini
org.seedstack.seed.security.realms = LdapRealm
```
    
If the property is not specified, the default realm is `ConfigurationRealm`.

{{% callout info %}}
Note that you can specify multiple realms. In that case the realms are tried in sequence and if at least one realm
successfully authenticates the subject, the overall attempt is considered successful. If none authenticate successfully, 
the attempt fails. The data from all the successful realms are merged.
{{% /callout %}}

### Configuration realm

This realm relies on the application configuration to authenticate subject and retrieve their roles. It is mainly intended
to be used for testing purposes. To declare subjects (called users in this realm), use the following configuration:
 
```ini
[org.seedstack.seed.security.users]
user1 = password, role1, role2
user2 = password, role3
```

This will define two subjects, `user1` and `user2` with their respective passwords and roles.

### X509 realm

This realm, which is intended to be used in a Web context, uses the certificates authorized by the Web server when an SSL 
connection is in use. It stores the certificates in the user principals as well as the UID declared in the certificate. 
It also uses the CN of the issuer of the certificates to define the basic roles of the user.

### LDAP realm

Check the [LDAP add-on documentation](/addons/ldap).

## Role/permission resolver

There is a role/permission resolver component per Realm. It resolves the Permissions assigned to a Role and provides them 
to the Realm. To attach a role/permission resolver to a Realm, use the following configuration:

```ini
org.seedstack.seed.security.<RealmName>.role-permission-resolver = ConfigurationRolePermissionResolver
```
    
Where `<RealmName>` corresponds to the name of the Realm this role/permission resolver is mapped to. The value corresponds
to the simple name of the implementing Java class. When no resolver is specified, the configuration-based role/permission
resolver is used.

### Configuration-based role/permission

This role/permission resolver uses the application configuration to do resolution. You can assign permissions to roles
with the following configuration:

```ini
[org.seedstack.seed.security.permissions]
role1 = permission1a:permission1b, permission2a:permission2b
role2 = permission3, permission4a:permission4b
role3 = permission5
role4 = permission6
```

This configuration assign permissions listed in values to their respective roles as keys. This is the default role/permission
resolver.

## Role mapping

**Optionally**, roles provided by realms can be mapped to application-specific roles. To do this, a role mapping component
should be defined in configuration:

```ini
org.seedstack.seed.security.<RealmName>.role-mapping = ConfigurationRoleMapping
```
    
Where `<RealmName>` corresponds to the name of the Realm this role mapping component is mapped to. The value corresponds
to the simple name of the implementing Java class. When no mapping is specified, the configuration-based role mapping
is used.

{{% callout info %}}
When no role mapping is specified, the roles provided by realms are directly used as application roles.
{{% /callout %}}
    
### Configuration-based role mapping

This role mapping uses the application configuration to do the mapping:

```ini
[org.seedstack.seed.security.roles]
role1 = ORG.APP.ROLE1, ORG.GLOBAL.ADMIN
role2 = ORG.APP.ROLE2
role3 = ORG.APP.{location}.ROLE3
role4 = *
```

This configuration defines the following mappings:

* Application-role `role1` is attributed to the subject when the realm provides `ORG.APP.ROLE1` **OR** `ORG.GLOBAL.ADMIN`.
* Application-role `role2` is attributed to the subject when the realm provides `ORG.APP.ROLE2`.
* Application-role `role3` is attributed to the subject when the realm provides `ORG.APP.FR.ROLE3`, where `FR` is converted 
into a security scope. As such a scoped `role3` is attributed to the subject, which is only valid in `FR` location.
* Application-role `role4` is attributed to every subject authenticated.

## Example

The following example is based on the defaults: a `ConfigurationRealm`, a `ConfigurationRolePermissionResolver` and a `ConfigurationRoleMapping`. Their declaration is optional but present here for clarity. You may want to replace each by a more suitable component, especially the `ConfigurationRealm` which uses the configuration as its users repository.

```ini
[org.seedstack.seed.security]
realms = ConfigurationRealm
ConfigurationRealm.role-mapping = ConfigurationRoleMapping
ConfigurationRealm.role-permission-resolver = ConfigurationRolePermissionResolver

[org.seedstack.seed.security.users]
admin = password1, APP.ADMIN
user1 = password2, APP.FR.MANAGER, APP.UK.MANAGER
user2 = password3, APP.BASIC

[org.seedstack.seed.security.roles]
admin = APP.ADMIN
manager = APP.ADMIN, APP.{location}.MANAGER
normal = APP.ADMIN, APP.BASIC
guest = *

[org.seedstack.seed.security.permissions]
admin = users:clear, cache:invalidate
manager = users:delete, users:create
normal = users:list
```

Note that:

* Application-roles (`admin`, `manager`, `normal` and `guest`) are attributed to a subject if it has **at least one** of the corresponding realm roles (`APP.ADMIN`, `APP.FR.MANAGER` , `APP.UK.MANAGER`, `APP.BASIC`). For instance, having the `APP.ADMIN` realm role is enough to have the `manager` application-role.
* Subject `user1` will only have the `users:delete` and `users:create` permissions on `FR` and `UK` locations.
* Subject `admin` will have the `users:delete` and `users:create` permissions everywhere (no location restriction).
* The `guest` application-role will be attributed to every identified subject.

# Usage

Access policy enforcement is achieved by using the Seed security API to protect specific sections of the application code. 
Any code can be secured, although restrictions may apply in some cases.

## Enforcement strategy

It is recommended to follow a well-defined strategy in placing security checks in application code. Failing to do so may
lead to unexpected security holes, as *one missing or incomplete check may be enough to compromise the entire application*.
Any well thought-out strategy will do, but you can consider applying one of the following (or both):

* **Entry-point security**. This strategy consists in only securing the code that allow to interact with the application.
This includes REST resources, servlets and filters, Web-Services, administrative commands, etc... Any applicative code
can theoretically only be reached through one of these entry points, so this strategy may be enough for most
applications.
* **In-depth security**. This strategy consists in independently securing each application behavior, regardless of its
depth in the call hierarchy. This includes all the entry points of the previous strategy as well as services, repositories,
finders, etc... It ensures that no behavior can be executed without the appropriate authorizations, regardless how it is
accessed. This strategy provides higher security, especially in applications with a lot of entry points or when entry 
points are often modified, but is costlier to implement. This cost can be mitigated by limiting the checks to critical 
application behavior only.

## Annotation-based checks

There are two annotations that checks for authorizations before allowing method execution:

* `@RequiresRoles` which checks that the current subject has one or more role(s) before allowing to execute the method.
* `@RequiresPermissions` which checks that the current subject has one or more permission(s) before allowing to execute
the method.

When the security check fails, an exception of type {{< java "org.seedstack.seed.security.AuthorizationException" >}}
is thrown.

{{% callout warning %}}
Note that these annotation-based security checks are implemented with **method interception** and are subject to 
**[its limitations](../../../concepts/dependency-injection#method-interception)**.
{{% /callout %}}

Examples:
```java
@RequiresRoles("administrator")
public void deleteUser(User user) {
    // This method is executed only if current subject has role 'administrator'
    // When not, an AuthorizationException is thrown
}

@RequiresPermissions("account:create")
public void createAccount(Account account) {
    // This method is executed only if current subject has permission 'account:create'
    // When not, an AuthorizationException is thrown
}
```

## Programmatic checks

If annotation-based security checks cannot be used, or if an programmatic style is preferred, the 
{{< java "org.seedstack.seed.security.SecuritySupport" >}} facade can be used. It provides various methods to explicitly check for 
current subject authorizations. It is more versatile than annotation-based checks and it is required when checking 
dynamically generated authorizations. To use it, simply inject it where needed:

	@Inject
	private SecuritySupport securitySupport;

To check if the current subject, if any, is authenticated:

    if (securitySupport.isAuthenticated()) {
        ...
    }
    
To check if the current subject, if any, has a specific role:

    if (securitySupport.hasRole("jedi")) {
        ...
    }

To check if the current subject, if any, has a specific permission:

	if (securitySupport.isPermitted("jediCouncil:attend")) {
		...
    }
 
{{% callout info %}}
There are multiple variations for each of these methods, and many more possibilities. Please refer to the 
[javadoc](/seed/org/seedstack/seed/security/api/SecuritySupport.html) for more information.
{{% /callout %}}

## Other checks
 
Seed security can provide additional ways to verify security depending on the technology used to access the application. 
For instance, in a Web application, HTTP requests can be filtered to execute security tasks or checks. For more information
about applying HTTP security filtering, refer to [this documentation](../../web/security).

## Access subject principals

Note that `SecuritySupport` provides access to current subject Principals:

	// Get current subject id
	securitySupport.getSimplePrincipalByName(Principals.IDENTITY).getValue();
	
	// Get current subject first name, if any
	securitySupport.getSimplePrincipalByName(Principals.FIRST_NAME).getValue();

# Extension

As Seed security is based on [Apache Shiro](http://shiro.apache.org), it can be extended by adding existing Shiro components
or by writing your own components. Seed also provides SPI to extend its own security features.

## Creating a Realm

You can create a custom Realm by following these steps:

1. Create a class that implements {{< java "org.apache.shiro.realm.Realm" >}} or extends an existing Shiro realm.
2. Use the realm class simple name as the realm name in the application configuration.

## Creating a RolePermissionResolver

You can create a custom Role/Permission resolver by following these steps:

1. Create a class that implements {{< java "org.apache.shiro.authz.permission.RolePermissionResolver" >}}.
2. Declare you want to use it on a realm in your properties.

## Creating a RoleMapping

You can create a custom Role mapping by following these steps:

1. Create a class that implements {{< java "org.seedstack.seed.support.security.core.authorization.RoleMapping" >}}.
2. Declare you want to use it on a realm in your properties.

# Testing

Testing the security model and its implementation is crucial to ensure effective security. This can be easily done with
Seed through specific integration tests. For a general overview of integration testing, please check 
[this documentation](../testing). 

## Configuration

You can choose to fully emulate your security infrastructure, for instance by using an LDAP test directory instead of the 
real one. The main benefit of this approach is that it tests the security effectiveness as closely as possible to the 
real environment. A simpler but still adequate approach is to override the security realm configuration to use a 
`ConfigurationRealm` and define test users in application configuration:

```ini
[org.seedstack.seed.security.users]
testUser1 = password, role1, role2
testUser2 = password, role1
testUser3 = password, role3
...
```
	
For more information about the Configuration realm, refer to [this section](#configuration-realm).
For more information on how to override the configuration for testing, refer to [this documentation](../#override).

## Subject authentication

To authenticate a subject before a test method is executed, use the {{< java "org.seedstack.seed.security.WithUser" "@" >}} annotation:

	@RunWith(SeedITRunner.class)
	public class MyITWithSecurity {
	    @Inject
	    private SecuritySupport securitySupport;
	    
	    @Inject
	    private MySecuredService mySecuredService;
	 

	    @Test(expected = AuthorizationException)
	    @WithUser(id = "testUser1", password = "password")
	    public void unprivileged_user_cannot_access_secured_service() {
	        mySecuredService.securedMethod();
	        fail("securedMethod() shouldn't have been called");
	    }
	    
	    @Test
	    @WithUser(id = "testUser3", password = "password")
	    public void admin_user_is_allowed_to_access_secured_service() {
	        mySecuredService.securedMethod();
	    }
	}

# Data security

The goal of the security on data is to protect the data exposed by an application. It has the ability to obfuscate any 
attribute of any object that does not pass the security restriction defined on it. For instance, an account number 
`79927391338710` can be transformed into `799273******10`.

## @Restriction annotation

This annotation can be applied on any class attribute. The field value will be obfuscated when data security will be applied:

    public class MySecuredPojo {
        @Restriction(value = "${ hasRole('manager') }", obfuscation = AccountObfuscationHandler.class)
        private String accountNumber;
        
        ...
    }

The value of the annotation is a security expression (see [this section](#security-expressions) for more details). If it 
evaluates to false against the current Subject the field will be obfuscated according to the `DataObfuscationHandler` 
specified (see [this section](#dataobfuscationhandler) for more details). The default obfuscation handler nullifies the 
field.

## Data security service

The security on data can be applied by using the `DataSecurityService` as follows:

    @Inject
    private DataSecurityService dataSecurityService;

    dataSecurityService.secure(myDto);

This service will go recursively through the object fields and look for restrictions. Each restriction that evaluates to f
alse against the current Subject will trigger the obfuscation of its associated field.

## @Secured annotation

You can add a `@Secured` annotation on any method parameter to automatically apply data security on it. You can also 
apply the `@Secured` annotation directly on the method to apply data security on the return value:

    @Secured
    public SecuredPojo1 securedMethod(@Secured SecuredPojo2 securedPojo2) {
        ...
    }

Every method annotated with `@Secured` or with the annotation applied to at least one of its parameters will be intercepted 
and the relevant objects will be secured. Note that the 
[usual interception limitations](/docs/seed/concepts/dependency-injection/#method-interception) apply.

{{% callout warning %}}
Please note that the data security interceptor will inspect the whole object graph starting from the secured object, so 
you may encounter some performance penalty depending on its size. It shouldn't be a problem for typical use.
{{% /callout %}}

## Security expressions

Security expressions are strings that respect the [Unified Expression Language (UEL)](https://uel.java.net/) syntax. The 
following methods are available:

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

## DataObfuscationHandler

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

## Custom annotations

Custom restriction annotations can be defined and registered with data security by defining a `DataSecurityHandler`. Start 
with defining a custom annotation:
    
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
