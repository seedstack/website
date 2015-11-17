---
title: "Security"
guide: "Create a reusable function"
author: "SeedStack"
menu:
    CreateFunctionGuide:
        weight: 50
---

The function security must be taken into account early in the conception and development process. Functions should provide 
to client applications a way to secure each feature very finely. SeedStack provides an expressive yet simple [security
model](/docs/seed/manual/security) that can be used in functions for modular security.

# Use permissions only

The key of reusable function security is to **use permissions instead of roles** as permissions are only related to the 
features the function provides and can be mapped to any role defined in client applications.

Permissions are arbitrary colon-delimited list of identifiers that express the secured action, going from the most general
to the most specific. In functions it is strongly recommended to start the permission with at least the function name.
You can even prefix it with the organization name if the function is going to be shared across organizations and the function
name is not distinctive enough. As an example, consider the following permission:

    seedstack:i18n:locale:delete

This permission denotes the ability to delete a locale in the 18n function of seedstack.      
      
# Backend security 

To enforce permissions, SeedStack provides a [declarative and a programmatic API](/docs/seed/manual/security/usage).
You can use either one or both but only rely on the permission checks, NOT the role checks.



> All the API methods which change the application state should be secured.

If the function provides W20 screen, menu items, pages and actions should be secured using the `w20Security` directive and the `AuthorizationService` service.

Even if the security must be provided, users should be able to not use it, ie. you should only import the `seed-security-specs` in your pom.
