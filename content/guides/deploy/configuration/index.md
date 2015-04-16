---
title: "Overview"
type: "reference"
zones:
    - "Guides"
sections:
    - "ConfigurationGuide"
menu:
    ConfigurationGuide:
        weight: 10
---

Configuration is a crucial part of an application that can be difficult to get right. It encompasses multiple aspects,
like logging, internal configuration or externalisation and should be treated with the same care that code.

# Configuration files

## Unified configuration
SEED provides an unified configuration that is consolidated from multiple classpath locations and is available throughout
the whole application. This configuration is sourced from two kind of files:
  
  * Props files (with the `.props` extension) placed under `META-INF/configuration`,
  * Properties files (with the `.properties` extension) placed under `META-INF/configuration`.

If possible, every configurable value should be placed in the unified configuration, preferably in props files (because
of their better expressiveness). Some of these files can then be externalized if necessary. Since the unified configuration
is aggregated from all classpath locations, one can only externalize necessary values, not whole files.

  
## Other configuration files
All other files are NOT participating in this unified configuration but can still be needed to configure various components
like the LDAP component or the logging subsystem for instance. These files can also be externalized if necessary but are
outside of SEED control, so they cannot be aggregated. It means that they must be externalized a whole file at a time.
 
# JNDI
Another aspect of application configuration is the use of JNDI resources which can be provided by the runtime environment
and configured administratively. The JNDI name is used inside the application as an alias to an externally defined resource.
 
# About this guide 

This guide will help you define which configuration aspects should be externalized (and which shouldn't) and the
best practices for each one.