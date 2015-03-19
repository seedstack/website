---
title: "Configuration"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
tags:
    - "security"
    - "configuration"
    - "ldap"
    - "certificate"
    - "role"
    - "permission"
    - "example"
menu:
    SeedSecurity:
        weight: 20
---

SEED security is designed to be easy to use and extend inside a SEED based application. This part focuses on the required
configuration in any environment (JEE, standalone, batch...). For any environment specific configuration, please refer to any specific security documentation of corresponding module.

# Security model definition

## Realms

Create a props file in `META-INF/configuration` and specify the realms you want to use. Define `org.seedstack.seed.security.realms` 
property and provide the name(s) of the `Realm` java class(es) you want as a value. SEED security brings three realms:
LdapRealm, X509CertificateRealm and ConfigurationRealm. For example, if you want to use the ConfigurationRealm and the
LdapRealm together, specify the following configuration:

	org.seedstack.seed.security.realms = ConfigurationRealm, LdapRealm

If no property is defined, the default realm is the `ConfigurationRealm`. If there is any identical role or any identical role/permission combination 
in Realms on which the user is authenticated, each role still remains attached to its parent `Realm` and the user can get an authorization from any of them.

### LdapRealm

!!! TODO: write an actual LdapRealm and document it !!!

### X509CertificateRealm

This realm uses the certificates authorized by the JEE server when authorizing the user in an SSL connection. It stores the certificates in the user principals as well as the UID declared in the certificate. It also uses the CN of the issuer of the certificates to define the basic roles of the user.

### ConfigurationRealm

This realm relies on your props to authenticate users and retrieve their roles. The preferred syntax is to declare a **[org.seedstack.seed.security.users]** 
section and then declare the users independently. 

For each user property, the key is the **user name** and the value is built with the **password** first followed by the different **roles** :

	[org.seedstack.seed.security.users]
	Obiwan = yodarulez, jedi, teacher
	Anakin = imsodark, padawan

## RolePermissionResolver

There is a `RolePermissionResolver` component per `Realm`. The `RolePermissionResolver` resolves the Permissions described in a Role and provides them to the realm.

Attach a `RolePermissionResolver` to a `Realm` as follows:

1. Create a **org.seedstack.seed.security.NameOfTheRealm.role-permission-resolver** property in your props file.
2. The value is the simple name of the `RolePermissionResolver` Class you want.

```
org.seedstack.seed.security.NameOfTheRealm.role-permission-resolver=ConfigurationRolePermissionResolver
```

SEED security brings a `RolePermissionResolver` based on Configuration in props :
**ConfigurationRolePermissionResolver**. 
This `RolePermissionResolver` Class is used by default if no other Class is defined in props.

In order to define the permissions:

1. Create a section **[org.seedstack.seed.security.permissions]** in your props file. 
2. Set properties with roles as keys and permissions as values.

```
[org.seedstack.seed.security.permissions]
jedi = lightSaber:wield, jediCouncil:attend
teacher = academy:teach
padawan = academy:learn
```

## RoleMapping

**Optionally**, you can define a `RoleMapping` to differentiate the "raw" roles brought by the different realms and the
functional roles brought by your application :

1. Attach a `RoleMapping` to your `Realm` by creating a **org.seedstack.seed.security.NameOfTheRealm.role-mapping** property in your props. 
2. The value is the simple name of the `RoleMapping` class you want.

SEED security brings a `RoleMapping` implementation based on Configuration in props : `ConfigurationRoleMapping`. 
This RoleMapping is capable of resolving placeholders in the "raw" role names and is used by default if no other Class is defined in props.

In order to define the mapping :

1. Create a **[org.seedstack.seed.security.roles]** section in your props file. 
2. Set properties with functional roles (meaningful for the application) as keys and set the values at the corresponding raw roles from the realms.

```
[org.seedstack.seed.security.roles]
jedi = SEED.JEDI
padawan = SEED.PADAWAN
teacher = SEED.$LOCATION$.TEACHER
```

Note: the LOCATION part of the raw role will be converted to a role scope. For instance, if the raw role is SEED.Coruscant.TEACHER,
the subject will be given the *teacher* role with the *Coruscant* scope. This scope will also apply to all permissions
derived from this role.

# Examples

## Role & permission mapping

The following example uses `ConfigurationRealm` and declares a `RolePermissionResolver` as well as a `RoleMapping`
(their declaration is optional but defined here for clarity):

	[org.seedstack.seed.security]
	realms = ConfigurationRealm
	
	ConfigurationRealm.role-mapping = ConfigurationRoleMapping
	ConfigurationRealm.role-permission-resolver = ConfigurationRolePermissionResolver
	
	[org.seedstack.seed.security.users]
	Obiwan = yodarulez, SEED.JEDI, SEED.Coruscant.TEACHER
	Anakin = imsodark, SEED.PADAWAN
	
	[org.seedstack.seed.security.roles]
	jedi = SEED.JEDI
	padawan = SEED.PADAWAN
	teacher = SEED.$DOMAIN$.TEACHER
	
	[org.seedstack.seed.security.permissions]
	jedi = lightSaber:wield, jediCouncil:attend
	teacher = academy:teach
	padawan = academy:learn

Note that Obiwan will have the domain *Coruscant* on the permission *academy:teach*.
