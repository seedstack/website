---
title: "Introduction"
guide: "Create a reusable function"
author: "SeedStack"
menu:
    CreateFunctionGuide:
        weight: 10
---

A function is a reusable portion of application that can span the whole stack from the domain to the UI. While it can
span the whole stack, it doesn't have to.

# What is its purpose ?

Functions are mainly intended to reuse functional use cases over multiple project (eg. i18n, export, batch monitoring).

# What is the difference between a function and an application ?

Functions are not intended to work as standalone but to be embedded in other applications. So functions must be 
thought to be **configurable but not configured**: function client must be able to configure the function to their
specific requirements (like the [security model](security) or the [persistence](persistence)).

For that purpose functions should depend on specifications (APIs or SPIs) and not on implementations where possible.
 
# How to create function from archetype ?

The command below will create a ready-to-code function project: 

    mvn org.seedstack.tools:seed-maven-plugin:scaffold-project -Dtype=function
    
Note that the created project contains sub-modules for the whole stack. You can delete the sub-modules you won't need.       
