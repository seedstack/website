---
title: "Security model"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
tags:
    - "security"
    - "permission"
    - "role"
    - "realm"
menu:
    SeedSecurity:
        weight: 15
---

Seed provides a security meta-model that is easy to understand yet powerful enough for the most complex applications. This
meta-model revolves around three main concepts: permissions, roles and subject. It allows to define a fine-grained and
modular security policy.

# Permissions

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

## Simple usage

The simplest expression of a permission is a single term String:
  
    printDocument
    deleteDocument
    viewDocument
    
These permissions represent the ability to `print`, `delete` or `view` a document. This very basic form of permission requires
to be granted one-by-one or with a `*` wildcard, which will grant all the permissions of the application. This may work
in the simplest applications but it is not recommended. The *multi-level* permissions should be preferred.

## Multi-level

Instead of expressing the permission as a single term, a multi-level permission can be used:

    document:print
    document:delete
    document:view
    
The colon (`:`) is a special character that is used to delimit the different parts of a multi-level permission. There
are no enforced requirements on how a multi-level permission should be organized, but it is recommended to go from the most
general to the most specific, from left to right. Also, there is no limit to the number of parts.

## Multiple values

Each part can contain multiple values, separated by commas (`,`):

    document:print,view
    
When assigning this permission to a subject, this grants the ability to `print` and `view` documents.

## All values

To grant all permissions of a specific level, use the `*` wildcard character:

    document:*
    *:view
    
The first permission, when assigned to a subject, allow to do any action on documents (meaning that any permission check
of the `document:XXX` pattern will be granted). The second permission grants the view action on all application resources
(meaning that any permission check of the `XXX:view` pattern will be granted).

## Instance-level checks

The identifier of a specific instance can be used at the end of a permission:

    document:print:doc273

This permission allows to print the document identified by the `doc273` identifier. 

## Missing parts

Missing parts in permissions imply that the user has access to all values corresponding to that part:

    printer:print
    
This permission is equivalent to:
    
    printer:print:*
    
Note that you can only leave off parts from the *end* of the permission.

# Roles

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

# Subjects

Subjects represent the entity which executes actions on the application. The most common type of subject is the `User`
type, which represents a human operator interacting with the application. Subjects are allowed to perform certain actions 
in your application through their association with roles or direct permissions. Assigning roles and permissions to subjects
is done through a `Realm` implementation.

# Realms

A realm implementation role is to translate a specific data-model, like an LDAP directory or a set of database tables, 
into a security policy expressed with the security meta-model described above. Seed provides several predefined realms:

* The `ConfigurationRealm` which computes the security policy from specific properties in the application configuration.
* The `LdapRealm` which computes the security policy from requests to a configured LDAP directory.
* The `X509CertificateRealm` which computes the security policy from an X509 certificate.

{{% callout info %}}
Custom realms can be implemented to compute any data-model into an enforceable security policy.
{{% /callout %}}

