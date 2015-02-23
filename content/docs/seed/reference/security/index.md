---
title: "Overview"
type: "reference"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
menu:
    SeedSecurity:
        weight: 10
---

SEED security support brings logical security to your applications with easy to use and configure:

* Identification (eg. id, name),
* Authentication (eg. password),
* Authorization (eg. roles, permissions).

If you need Java based security in your applicative module, you can use the following maven dependency :

    <dependency>
        <groupId>org.seedstack.seed</groupId>
        <artifactId>seed-security-support-core</artifactId>
    </dependency>

Security extensions for various execution environments are provided in other SEED supports. One of the most useful
is the Web security extension available [here](#!/seed-doc/web/security).

#Concepts

## Realm

A security realm is a mechanism used for protecting application resources.
A `Realm` is a component of SEED security support that handles security data includind users, roles and permissions.

## Permission

Permissions are the most atomic level of a security policy. Permissions define what can be done in your application. 
A well formed permission statement describes what actions are available on a specific ressource or a set of resources.

For example, "drink beverage" is a permission, "print document" is another one as well as "print document on printer
MUIPCC". These permissions can be easily defined by using wildcard notation :

* drink a beverage -> beverage:drink
* print a document -> document:print
* light a document on fire -> document:lighOnFire
* print anything on MUIPCC -> *:print:MUIPCC
* do whatever you want with a document -> document:*

## Role

A Role is a set of permissions. If a user is granted a Role, the user is thereby granted all the Permissions defined in this Role.

## Filter

In a Web environment (on a JEE server) you can define a Filter chain on URLs of your application to apply security.
For example you can add a Basic Auth Filter or add a Filter to check users' Role/Permission.

See the dedicated web [documentation](#!/seed-doc/web/security#security-filters) on this subject.
