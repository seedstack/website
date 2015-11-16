---
title: "Persistence"
guide: "Create a reusable function"
author: "SeedStack"
menu:
    CreateFunctionGuide:
        weight: 40
---

# Which persistence to choose ?

All persistence supports can be used by functions.

# Configuration

Function must allow users to configure the persistence. For instance, if the function uses JPA, it must provide a 
configurable JPA unit. The data structure (like tables in the case of JPA) can often be defined by the user to be
automatically created upon application startup. But creation scripts or similar means of creating the data structure 
should be provided for clients requiring full control over data structure creation. 

# Backup & Restore

Functions must provide a way to import and restore data independently from the persistence, ie. function should not provide 
SQL scripts. This will allow the function to change the persistence later and reuse existing user data. This should be 
done with the [Java framework data facilities](/docs/seed/manual/core/data). If needed, the function can also provide 
golden data (i.e. data automatically added to the persistence upon application first start) with the same mechanism.

{{% callout info %}}
Note that persistence is optional. For instance, SeedStack IO function does not use persistence at all.
{{% /callout %}}






