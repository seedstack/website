---
title: "Data security API"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
menu:
    SeedSecurity:
        weight: 50
---

# Concepts
The goal of the security on data is to protect the data exposed by an application. It will take data representations and obfuscate them when the user is not allowed to see them according to its roles and permissions.

> For instance: a primary account number `79927391338710` will be transformed into `799273****8710`.

# Service usage

The security on data can be applied by using the building blocks provided by the SEED Business Framework or by using the `DataSecurityService` as follows:

    @Inject
    private DataSecurityService dataSecurityService;

    dataSecurityService.secure(myDto);

This service will go through the object fields and look for a security expression (eg. the `@Restriction` annotation of the SEED Business Framework). If the current user does not match the security expression requirements, the field will be obfuscated.

Here is the interface for the `DataSecurityService`:

    public interface DataSecurityService {
	
	    <Candidate> void secure(Candidate c);

    }

The obfuscation is delegated to a `DataObfuscationHandler` (see how to implement your [obfuscator](/#!/seed-doc/security/data-obfuscation)). By default if no obfuscator handler is given the data will be nullify. 

# Expression language

The security expression could Boolean or String. When they are String, they will be evaluated as expression language (EL). The SEED security support provides extends the EL with the following methods:



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
