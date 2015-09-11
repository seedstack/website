---
title: "Overview"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
tags:
    - "security"
    - "authentication"
    - "authorization"
    - "access control"
menu:
    SeedSecurity:
        weight: 10
---

Seed provides application security through a powerful security model, which is equally easy to configure and to enforce.
It takes charge of the following tasks:

* Identification (provides the identity of a subject),
* Authentication (verifies the subject identity),
* Authorization (defines which roles and permissions a subject can have),
* Access-control (enforces access restrictions to entry-points and/or to any arbitrary code). 

To enable security to your project, you need to add the following Maven dependency:

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-security-support-core</artifactId>
    </dependency>

{{% callout warning %}}
This dependency provides all the security features described above but only on code. Specific entry-point protection is 
provided in various Seed modules. **In particular, be sure to read the documentation about the [Web security](../web/security)
module to enforce access control on HTTP entry-points**.
{{% /callout %}}

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

# Tasks
 
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
