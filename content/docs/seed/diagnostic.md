---
title: "Error diagnostic"
type: "home"
zones:
    - "Seed"
sections:
    - "SeedEssentials"
tags:
    - "diagnostic"    
menu:
    SeedEssentials:
        weight: 50
---

When something goes wrong, SeedStack does its best to provide detailed information about the failure. This can
take two forms: the detailed exception system and the diagnostic dump.
 
# Detailed exception system
 
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
 
# Diagnostic dump 

Seed can dump diagnostic information when an exception is catched at key application locations. Core support dumps 
diagnostic information when an uncaught exception occurs in a thread but other supports can trigger dumps in various 
conditions.

Diagnostic information is an aggregation of values gathered from various diagnostic collectors in a single map. This map
is then handled by the diagnostic reporter. 

## Diagnostic collectors

A diagnostic collector is a class implementing the {{< java "org.seedstack.seed.spi.diagnostic.DiagnosticInfoCollector" >}} 
interface and annotated with {{< java "org.seedstack.seed.spi.diagnostic.DiagnosticDomain" "@" >}}:

    @DiagnosticDomain("org.my-organization.my-project.my-diagnostic-domain")
    public class MyDiagnosticCollector implements DiagnosticInfoCollector {

        @Override
        public Map<String, Object> collect() {
            ...
        }
        
    }

All diagnostic collectors are automatically detected by Seed and will be used in diagnostic information gathering. The
diagnostic domain uniquely identifies the information of the collector.

## Diagnostic reporter

The default diagnostic reporter dumps the map as a YAML document in the system temporary directory and logs the filename
at WARNING level. The diagnostic reporter can be changed by setting the `seedstack.diagnostic` system property to a class 
implementing {{< java "org.seedstack.seed.spi.diagnostic.DiagnosticReporter" >}}.

