---
title: "Usage"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
menu:
    SeedSecurity:
        weight: 30
---

This document describes how to interact with security credentials and attributes of a user in your code: 

* principals (eg. name, etc.)
* role(s)
* permission(s)
* etc

# Declarative API

Annotate your methods to only authorize users with required roles and/or permissions:

	import com.inetpsa.seed.security.api.annotations.RequiresRoles;
	import com.inetpsa.seed.security.api.annotations.RequiresPermissions;

	@RequiresRoles("administrator")
	public void deleteUser(User user) {
		//This method is called only if user has role administrator
		//else throws AuthorizationException
	}

	@RequiresPermissions("account:create")
	public void createAccount(Account account) {
		//This method is called only if user has permission account:create
		//else throws AuthorizationException
	}

# Programmatic API

## SecuritySupport

Inject `SecuritySupport` in your class:

	import com.inetpsa.seed.security.api.SecuritySupport;
	...
	@Inject
	private SecuritySupport securitySupport;

## User principals

Note that `SecuritySupport` provides user `Principals` through `PrincipalProvider`. For example :

	String userId = securitySupport.getSimplePrincipalByName(Principals.IDENTITY).getValue();
	String firstName = securitySupport.getSimplePrincipalByName(Principals.FIRST_NAME).getValue();

## Check authorizations

Get user's authorizations (roles, permissions) with `hasRole()`, `checkPermission()` (throws AuthorizationException) and `isPermitted()` methods:

	if(securitySupport.isAuthenticated())
		//he is authenticated !
	if(securitySupport.hasRole("jedi"))
		//he is a jedi !
	if(securitySupport.isPermitted("printer:print:MUIPCC"))
		//he can print on printer MUIPCC !
	try{
		securitySupport.checkPermission("beverage:drink");
		//do some stuff for people who can drink a beverage
	}catch(AuthorizationException e){
		//can't drink beverage
	}
	if(securitySupport.isPermitted(new DomainPermission("MU", "part:delete"))
		//he can delete a part on the domain MU !
