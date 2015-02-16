---
title: "Configuration"
zones:
    - "Functions"
sections:
    - "FunctionBridge"
menu:
    FunctionBridge:
        weight: 30
---

Several configuration options are possible to alter the W20 part of your application.

# Loading options

## Timeout

The W20 loader has a predefined time limit to load all the application assets. Although the default value of 30 seconds
should be enough for all applications, tt is sometimes desirable to increase it with the following option:

    org.seedstack.w20.timeout = 60

## CORS with credentials

To allow the application to access **secured** resources from other domains than its own, use the following option:

    org.seedstack.w20.cors-with-credentials = true

This option is not necessary when accessing its own resources or publicly accessible cross-origin resources only.

# Application options

## Title

You can set the W20 application title with the following option:

    org.seedstack.w20.application.title = My application

The default value is set to the SEED application name (coming from the `org.seedstack.seed.core.application-name`).

## Subtitle

You can set the W20 application subtitle with the following option:

    org.seedstack.w20.application.subtitle = A great application

There is no default value.

## Version

You can set the W20 application version with the following option:

    org.seedstack.w20.application.version = 1.2.3

The version is treated as a string so there is no restriction format. The default value is set to the SEED application
version (coming from the `org.seedstack.seed.core.application-version`). It is not recommended to change this default
value, other than for testing purposes or special cases. The version string is appended to all assets URLs by the
W20 loader to ensure that resources are refreshed when the version change.
