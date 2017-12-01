---
title: "Security"
type: "home"
zones:
    - "Docs"
tags:
    - security
aliases: /docs/seed/manual/security    
menu:
    docs:
        parent: "core"
        weight: 5
---

The `seed-security-core` module provides application-level security.<!--more--> It takes charge of the following tasks:

* Identification (provides the identity of a subject),
* Authentication (verifies the subject identity),
* Authorization (defines which roles and permissions a subject can have),
* Access-control (enforces access restrictions to entry-points and/or to any arbitrary code). 

{{% callout info %}}
The security engine used by SeedStack is [Apache Shiro](http://shiro.apache.org/).
{{% /callout %}}

Security support requires the following dependency in your project:

{{< dependency g="org.seedstack.seed" a="seed-security-core" >}}

## Concepts

### Subjects

Subjects represent the entity which executes actions on the application. The most common type of subject is the "User"
type, which represents a human operator interacting with the application. Subjects are allowed to perform certain actions 
in your application through their association with roles or direct permissions. Assigning roles and permissions to subjects
is done through one or more `Realm`.    

### Roles

A Role is a named entity that typically represents a set of behaviors or responsibilities. Those behaviors translate to 
things you can or can't do with an application. Roles are typically assigned to subject like user accounts, so by 
association, subjects can *do* the things attributed to various roles.
 
### Permissions

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

#### Simple usage

The simplest expression of a permission is a single term String:
  
    printDocument
    deleteDocument
    viewDocument
    
These permissions represent the ability to `print`, `delete` or `view` a document. This very basic form of permission requires
to be granted one-by-one or with a `*` wildcard, which will grant all the permissions of the application. This may work
in the simplest applications but it is not recommended. The *multi-level* permissions should be preferred.

#### Multi-level

Instead of expressing the permission as a single term, a multi-level permission can be used:

    document:print
    document:delete
    document:view
    
The colon (`:`) is a special character that is used to delimit the different parts of a multi-level permission. There
are no enforced requirements on how a multi-level permission should be organized, but it is recommended to go from the most
general to the most specific, from left to right. Also, there is no limit to the number of parts.

#### Multiple values

Each part can contain multiple values, separated by commas (`,`):

    document:print,view
    
When assigning this permission to a subject, this grants the ability to `print` and `view` documents.

#### All values

To grant all permissions of a specific level, use the `*` wildcard character:

    document:*
    *:view
    
The first permission, when assigned to a subject, allow to do any action on documents (meaning that any permission check
of the `document:XXX` pattern will be granted). The second permission grants the view action on all application resources
(meaning that any permission check of the `XXX:view` pattern will be granted).

#### Instance-level checks

The identifier of a specific instance can be used at the end of a permission:

    document:print:doc273

This permission allows to print the document identified by the `doc273` identifier. 

#### Missing parts

Missing parts in permissions imply that the user has access to all values corresponding to that part:

    printer:print
    
This permission is equivalent to:
    
    printer:print:*
    
Note that you can only leave off parts from the *end* of the permission. 
    
## Realms

A security realm is responsible for authenticating and authorizing subjects. Realms can retrieve information from various
data sources.

Configuring realms is done as below:
    
{{% config p="security.realms" %}}
```yaml
security:
  # Ordered list of security realms used to authenticate and authorize subjects
  realms:
    - 
      # Name of the security realm
      name: (String)
      
      # Name of the role mapper used for this realm (optional)
      roleMapper: (String)
      
      # Name of the permission resolver used for this realm (optional)
      permissionResolver: (String)
```
{{% /config %}}    

### Built-in realms

SeedStack provides the following realms:

* `ConfigurationRealm` which uses the application configuration.
* `X509CertificateRealm` which uses X509 certificates.
* `LdapRealm` which uses an LDAP directory.

{{% callout warning %}}
`ConfigurationRealm` is the default realm, which is fine for development and testing purposes. You may need to use
more robust and flexible realms in production, like the `LdapRealm`.
{{% /callout %}}

#### Configuration-based realm

This realm relies on the application configuration to authenticate subject and retrieve their roles. It is mainly intended
to be used for testing purposes. To declare subjects (called users in this realm), use the following configuration:
 
{{% config p="security.users" %}}
```yaml
security:
  # Map of users and their properties
  users:
    user1:
      # Password of the user
      password: somePassword
      
      # List of roles granted to the user.
      roles: [ role1, role2 ]
```
{{% /config %}}   
 
This configuration defines one subject named `user1` with its respective password and roles.

#### X509 certificate realm
 
This realm, which is intended to be used in Web applications, uses the certificates authorized by the Web server when an SSL 
connection is in use. It stores the certificates in the user principals as well as the UID declared in the certificate. 
It also uses the CN of the issuer of the certificates to define the basic roles of the user.

#### LDAP realm

This realm is available in the [LDAP add-on]({{< ref "addons/ldap/index.md" >}}).

#### Custom realm

You can create a custom realm by:

* Creating a class that implements {{< java "org.seedstack.seed.security.Realm" >}}.
* Use the realm class simple name in the name configuration attribute of the realm.

### Permission resolver
   
Each realm has its own permission resolver. It resolves the permissions granted for a given role. 

#### Configuration-based permission resolver

This is the default permission resolver. It uses the application configuration to resolve permissions for roles:

{{% config p="security.permissions" %}}
```yaml
security:
  # Map of permissions for a particular role
  permissions:
    role1Name: 
      - permission1
      - permission2
      - permission3
    role2Name: 
      - permission1
      - permission4
```
{{% /config %}}  

#### Custom permission resolver

You can create a custom permission resolver by:

* Creating a class that implements {{< java "org.seedstack.seed.security.RolePermissionResolver" >}}.
* Using your class simple name in the permissionResolver configuration attribute of the realm.

### Role mapper

Each realm has its own role mapper. It has the ability to map a role name retrieved by the realm to a more friendly 
application role name. 

#### Configuration-based role mapper

This is the default role mapper. It uses the application configuration to map role names:

{{% config p="security.roles" %}}
```yaml
security:
  # Mapping of role names
  roles:
    role1: [ 'ORG.APP.ROLE1', 'ORG.GLOBAL.ADMIN' ]
    role2: [ 'ORG.APP.ROLE2' ]
    role3: 'ORG.APP.{location}.ROLE3'
    role4: '*'
```
{{% /config %}}  

The configuration above configuration defines the following mappings:

* Application-role `role1` is attributed to the subject when the realm provides `ORG.APP.ROLE1` **OR** `ORG.GLOBAL.ADMIN`.
* Application-role `role2` is attributed to the subject when the realm provides `ORG.APP.ROLE2`.
* Application-role `role3` is attributed to the subject when the realm provides `ORG.APP.FR.ROLE3`, where `FR` is converted 
into a security scope. As such a scoped `role3` is attributed to the subject, which is only valid in `FR` location.
* Application-role `role4` is attributed to every subject authenticated.

{{% callout warning %}}
An application role is granted when **at least one** of the realm roles in the list is granted (logical OR).
{{% /callout %}}

#### Custom role mapper

You can create a custom role mapper by:

* Creating a class that implements {{< java "org.seedstack.seed.security.RoleMapping" >}}.
* Using your class simple name in the roleMapper configuration attribute of the realm.

## Example

The following example is based on the defaults: 

* A `ConfigurationRealm`,
* A `ConfigurationRolePermissionResolver`,
* A `ConfigurationRoleMapping`.

```yaml
security:
  users:
    admin:
      password: password1
      roles: 'APP.ADMIN'
    user1:
      password: password2
      roles: [ 'APP.FR.MANAGER', 'APP.UK.MANAGER' ]
    user2:
      password: password3
      roles: 'APP.BASIC'
  roles:
    admin: 'APP.ADMIN'
    manager: [ 'APP.ADMIN', 'APP.{location}.MANAGER' ]
    normal: [ 'APP.ADMIN', 'APP.BASIC' ]
    guest: '*'
  permissions:
    admin: [ 'users:clear', 'cache:invalidate' ]
    manager: [ 'users:delete', 'users:create' ]
    normal: 'users:list'
```

Note that:

* Application-roles (`admin`, `manager`, `normal` and `guest`) are attributed to a subject if it has **at least one** 
of the corresponding realm roles (`APP.ADMIN`, `APP.FR.MANAGER` , `APP.UK.MANAGER`, `APP.BASIC`). 
For instance, having the `APP.ADMIN` realm role is enough to have the `manager` application-role.
* Subject `user1` will only have the `users:delete` and `users:create` permissions on `FR` and `UK` locations.
* Subject `admin` will have the `users:delete` and `users:create` permissions everywhere (no location restriction).
* The `guest` application-role will be attributed to every identified subject.

## Usage

Access-control can be done by two means: annotation-based checks and programmatic checks.

{{% callout tips %}}
It is **strongly recommended** to check for permissions, instead of checking for roles. Since a permission represent
an action, it is a natural fit for protecting the portion of code implementing this very action. On the contrary a 
role check is generally too broad.
{{% /callout %}}

### Annotation-based checks

There are two annotations that checks for authorizations before allowing method execution:

* {{< java "org.seedstack.seed.security.RequiresRoles" "@" >}} which checks that the current subject has one or more 
role(s) before allowing to execute the method.
* {{< java "org.seedstack.seed.security.RequiresPermissions" "@" >}} which checks that the current subject has one or 
more permission(s) before allowing to execute the method.

When the security check fails, an exception of type {{< java "org.seedstack.seed.security.AuthorizationException" >}}
is thrown:

```java
public class SomeClass {
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
}
```

{{% callout danger %}}
Note that these annotation-based security checks are implemented with **method interception** and are subject to 
**[its limitations](/docs/seed/dependency-injection/#method-interception)**.
{{% /callout %}}

### Programmatic checks

If annotation-based security checks cannot be used, or if a programmatic style is preferred, the 
{{< java "org.seedstack.seed.security.SecuritySupport" >}} facade can be injected: 

```java
public class SomeClass {
	@Inject
	private SecuritySupport securitySupport;
	
	public void doChecks() {
        // To check if the current subject, if any, is authenticated:
        if (securitySupport.isAuthenticated()) {
            doSomething();
        }
        
        // To check if the current subject, if any, has a specific role:
        if (securitySupport.hasRole("admin")) {
            clearUsers();
        }
    
        // To check if the current subject, if any, has a specific permission:
        if (securitySupport.isPermitted("cache:invalidate")) {
            flushCache();
        }	    
	}
}
```

### Access to subject principals

The {{< java "org.seedstack.seed.security.SecuritySupport" >}} facade provides access to current subject principals:

```java
public class SomeClass {
	@Inject
	private SecuritySupport securitySupport;
	
	public void retrievePrincipals() {
        // Get current subject id
        securitySupport.getSimplePrincipalByName(Principals.IDENTITY).getValue();
        
        // Get current subject first name, if any
        securitySupport.getSimplePrincipalByName(Principals.FIRST_NAME).getValue(); 
	}
}
```

## Testing

Testing the security model and its effective enforcement is a good practice. 

### Defining test users

In your test configuration, you can use the `ConfigurationRealm` realm to define test users like described [here](#configuration-based-realm). 

### Subject authentication

To authenticate a subject before a test method is executed, use the {{< java "org.seedstack.seed.security.WithUser" "@" >}} annotation:

```java
	@RunWith(SeedITRunner.class)
	public class SomeSecurityIT {
	    @Inject
	    private SecuritySupport securitySupport;
	    
	    @Inject
	    private MySecuredService mySecuredService;
	 

	    @Test(expected = AuthorizationException.class)
	    @WithUser(id = "basic", password = "password")
	    public void unprivilegedUserCannotAccessSecuredService() {
	        mySecuredService.securedMethod();
	        fail("securedMethod() shouldn't have been called");
	    }
	    
	    @Test
	    @WithUser(id = "admin", password = "password")
	    public void adminUserIsAllowedToAccessSecuredService() {
	        mySecuredService.securedMethod();
	    }
	}
```
