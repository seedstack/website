---
title: "Extension"
type: "manual"
zones:
    - "Seed"
sections:
    - "SeedSecurity"
tags:
    - "spi"
    - "security"
    - "role"
    - "permission"
    - "realm"
menu:
    SeedSecurity:
        weight: 80
---

As Seed security is based on [Apache Shiro](http://shiro.apache.org), it can be extended by adding existing Shiro components
or by writing your own components. Seed also provides SPI to extend its own security features.

# Creating a Realm

You can create a custom Realm by following these steps:

1. Create a class that implements `org.apache.shiro.realm.Realm` or extends an existing Shiro realm.
2. Use the realm class simple name as the realm name in the application configuration.

# Creating a RolePermissionResolver

You can create a custom Role/Permission resolver by following these steps:

1. Create a class that implements `org.apache.shiro.authz.permission.RolePermissionResolver`.
2. Declare you want to use it on a realm in your properties.

# Creating a RoleMapping

You can create a custom Role mapping by following these steps:

1. Create a class that implements `org.seedstack.seed.support.security.core.authorization.RoleMapping`.
2. Declare you want to use it on a realm in your properties.