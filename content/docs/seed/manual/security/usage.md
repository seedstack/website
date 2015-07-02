---
title: "Usage"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
tags:
    - "security"
    - "api"
    - "principals"
    - "role"
    - "permission"
menu:
    SeedSecurity:
        weight: 30
---

Access policy enforcement is achieved by using the Seed security API to protect specific sections of the application code. 
Any code can be secured, although restrictions may apply in some cases.

# Enforcement strategy

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

# Annotation-based checks

There are two annotations that checks for authorizations before allowing method execution:

* `@RequiresRoles` which checks that the current subject has one or more role(s) before allowing to execute the method.
* `@RequiresPermissions` which checks that the current subject has one or more permission(s) before allowing to execute
the method.

When the security check fails, an exception of type `org.seedstack.seed.security.api.exceptions.AuthorizationException`
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

# Programmatic checks

If annotation-based security checks cannot be used, or if an programmatic style is preferred, the 
`org.seedstack.seed.security.api.SecuritySupport` facade can be used. It provides various methods to explicitly check for 
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
[javadoc](http://www.seedstack.org/seed/org/seedstack/seed/security/api/SecuritySupport.html) for more information.
{{% /callout %}}

# Other checks
 
Seed security can provide additional ways to verify security depending on the technology used to access the application. 
For instance, in a Web application, HTTP requests can be filtered to execute security tasks or checks. For more information
about applying HTTP security filtering, refer to [this documentation](../../web/security).

# Access subject principals

Note that `SecuritySupport` provides access to current subject Principals:

	// Get current subject id
	securitySupport.getSimplePrincipalByName(Principals.IDENTITY).getValue();
	
	// Get current subject first name, if any
	securitySupport.getSimplePrincipalByName(Principals.FIRST_NAME).getValue();
