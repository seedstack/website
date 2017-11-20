---
title: "Troubleshooting"
type: "home"
zones:
    - "Docs"
tags:
    - tutorial
    - essentials
menu:
    docs:
        parent: "basics"
        weight: 7
---

When something goes wrong, SeedStack does its best to provide detailed information about the failure. This can
take two forms: the detailed exception system and the diagnostic dump.
 
## Detailed exception system
 
All SeedStack exceptions extend {{< java "org.seedstack.shed.exception.BaseException" >}} which is a 
[RuntimeException](https://docs.oracle.com/javase/8/docs/api/java/lang/RuntimeException.html). This means that you are
not required to catch framework exceptions although you can do so if needed.
 
All SeedStack exceptions display a detailed information report about the failure. Consider this example:
 
```plain
org.seedstack.seed.SeedException: [CORE] Unexpected exception


Description
-----------
Unexpected exception during Seed startup or shutdown.

Causes
------

1. com.google.inject.ProvisionException: Unable to provision, see the following errors:
   
   1) Error injecting org.seedstack.seed.core.ConfigurationIT$Holder using
   org.seedstack.seed.core.internal.configuration.ConfigurationMembersInjector@17271176.
    Reason: [CORE] Unable to inject configuration value
     while locating org.seedstack.seed.core.ConfigurationIT$Holder
   
   1 error @(InjectorImpl.java:1025)

2. [CORE] Unable to inject value from configuration key 'missingProperty' in field 'configObject2' of class
   'org.seedstack.seed.core.ConfigurationIT.Holder'. @(ConfigurationMembersInjector.java:54)

3. [CORE] Missing mandatory configuration key 'missingProperty'. @(ConfigurationMembersInjector.java:48)

Fix
---
Ensure that the configuration key 'missingProperty' is present and that the configuration source is correctly detected.

Online information
------------------
http://seedstack.org/docs/seed/configuration#usage

Stacktrace
----------
...
```

You can find the following information in this exception report:

* The exception type: {{< java "org.seedstack.seed.SeedException" >}}.
* The module and the error code: `CORE` and `Unexpected exception`.
* The textual description of the error: "Unexpected exception during Seed startup or shutdown".
* A list of causes which is built from the Java exception chaining mechanism:
  * A Guice `ProvisionException` which occurred when trying to inject a class,
  * A `SeedException` which occurred when the configuration custom injector failed to the `configObject2` field,
  * Another `SeedException` which occurred because the `missingKey` configuration key was mandatory and is missing.
* The fix which is an advice on how to fix the root cause, i.e. the missing configuration key.
* The online information which is an URL pointing to a Web resource related to the root cause.
* The detailed stacktrace of the chained exceptions.
 
## Diagnostic dump 

When an exception is thrown on startup or shutdown, a YAML diagnostic file is dumped in a temporary directory. A diagnostic 
dump contains a lot of information about the SeedStack runtime. It can be helpful to do advanced diagnostics.

{{% callout info %}}
A warning log will tell where the diagnostic file is saved.
{{% /callout %}} 

